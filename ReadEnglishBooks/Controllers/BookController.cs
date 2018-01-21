using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReadEnglishBooks.Models;
using System.IO;
using System.Collections.Generic;
using ReadEnglishBooks.Helpers;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Hosting.Server;
using Newtonsoft.Json;
using System.Data;
using System.Data.SQLite;
using System.Threading.Tasks;
using System.Diagnostics;
using ReadEnglishBooks.Data;
using System.Data.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ReadEnglishBooks.Controllers
{
    public class BookController : Controller
    {
        private static BookModel book;
        private static BookModelDB bookModelDB;
        private string pageNumberTag = "<br/><div class='page-number'>";
        private string divTag = "</div>";
        private string pageCountTag = "<br/><div class='page-count' hidden>";
        private static ApplicationDbContext db;
        
        public BookController()
        {
                        
        }

        public async Task<JsonResult> CreateBookDBFromFile(string book_folder, string book_name)
        {
            book = new BookModel(Directory.GetCurrentDirectory() + "\\Assets\\" + book_folder + "\\" + book_name);
            if (book != null)
            {
                var sqliteHelper = new SqliteHelper();
                book_name = book_name.Split('.').ElementAt(0);
                var res1 = await sqliteHelper.AddpLabelToBookTable(book_folder, book_name, book.Author, book.BookName, book.BookContents);
                var res2 = await sqliteHelper.AddpPagesToBookTable(book_folder, book_name, book.PagesArray);
            }
            return Json(null);
        }

        // GET: Book
        public async Task<ActionResult> BookView(string book_folder, string book_name)
        {
            if (User != null && User.Identity.IsAuthenticated)
            {
                db = ApplicationDbContext.Create();
            }

            if (book_folder != null && book_name != null)
            {
                if (db != null)
                {
                    var user = db.Users.Where(t => t.UserName == User.Identity.Name).FirstOrDefault();
                    if (user != null)
                    {
                        user.BookName = book_name;
                        ViewBag.pageNumber = user.Bookmark;
                        db.SaveChanges();
                    }
                }
                else
                {
                    ViewBag.pageNumber = 1;
                }

                bookModelDB = new BookModelDB(book_folder, book_name.Split('.').ElementAt(0));
                ViewBag.BookName = await bookModelDB.getBookHeader();
                ViewBag.BookAuthor = await bookModelDB.getBookAuthor();
                ViewBag.BookContents = await bookModelDB.getBookContents();
            }
            return View();
        }

        public async Task<JsonResult> GetPage(int page)
        {
            List<string> pages = new List<string>();
            
            try
            {
                var author = await bookModelDB.getBookAuthor();
                var bookPage = await bookModelDB.getBookPage(page);
                if (bookPage != null)
                {
                    if (db != null)
                    {
                        var user = db.Users.Where(t => t.UserName == User.Identity.Name).FirstOrDefault();
                        if (user != null)
                        {
                            user.Bookmark = page;
                            db.SaveChanges();
                        } 
                    }
                                        
                    pages.Add(String.Join(String.Empty, bookPage.ToArray()) +
                        pageNumberTag +
                        (page) +
                        divTag +
                        pageCountTag +
                        bookModelDB.getPageCount() +
                        divTag);

                    SqliteHelper sqliteHelper = new SqliteHelper();
                    var wordsList = sqliteHelper.GetWordsListAsync(bookPage);
                    pages.Add(JsonConvert.SerializeObject(wordsList));                    
                }                
            }
            catch (ArgumentNullException ex)
            {
                Debug.WriteLine(ex.Message);
                pages.Add("Книга не найдена");
            }
            catch(Exception ex)
            {
                pages.Add(ex.Message);
                Debug.WriteLine(ex.Message);
            }
            return Json(pages);
        }

        [HttpPost]
        public ActionResult GetTextFromClient(string text, bool issentence)
        {
            StringHelper strHelper = new StringHelper();
            Translator translator = new Translator();
            List<Word> words_list = new List<Word>();
            List<string> list = null;
            if (!issentence)
            {
                list = strHelper.splitByWords(text); 
            }
            else
            {
                list = new List<string> { text };
            }
            var words = translator.GetTranslateFromYandex(list);
            string message = "";

            if (words != null && words.code == 200)
            {
                words_list = words.wordsList;
                message = "Ok";
            }
            else if(words.code != 200)
            {
                switch (words.code)
                {
                    case 400:
                        message = "Недопустимый запрос";
                        break;
                    case 401:
                        message = "Неправильный API-ключ";
                        break;
                    case 402:
                        message = "API-ключ заблокирован";
                        break;
                    case 404:
                        message = "Превышено суточное ограничение на объем переведенного текста";
                        break;
                    case 413:
                        message = "Превышен максимально допустимый размер текста";
                        break;
                    case 422:
                        message = "Текст не может быть переведен";
                        break;
                    case 501:
                        message = "Заданное направление перевода не поддерживается";
                        break;
                    default:
                        message = "Опаньки... Произошла непредвиденная ошибка";
                        break;
                }           
            }
            else if (words.code < 0)
            {
                message = "words.code < 0";
                words_list.Add(new Word() { Eng = text, Rus = null, IsRepeat = false });
            }
            else
            {
                message = "Error: HomeController -> GetTextFromClient -> trans=null";
                words_list.Add(new Word() { Eng = text, Rus = null, IsRepeat = false });
            }
            
            var jsondata = words_list.Select(w => new
            {
                Message = message,
                English = w.Eng,
                Translate = w.Rus
            });
            
            return Json(jsondata);
        }

        [HttpPost]
        public async Task<JsonResult> GetWordsFromClient(string data)
        {
            List<Word> words = null;
            Dictionary<string, string> response = null;
            int res = -1;
            if (data != null)
            {
                words = JsonConvert.DeserializeObject<List<Word>>(data.ToString());
                //words.ForEach(i => i.IsRepeat = true);
                SqliteHelper sqliteHelper = new SqliteHelper();
                res = await sqliteHelper.AddEntiesToTable(words);

                response = new Dictionary<string, string>();
                response.Add("message", "Ok");
                response.Add("res", res.ToString());
            }
            else
            {
                response = new Dictionary<string, string>();
                response.Add("message", "BookController.GetWordsFromClient(data):   Error - data is null");
                response.Add("res", res.ToString());
            }
            
            return Json(response);
        }

        public async Task<JsonResult> GetSettings()
        {
            Task<JsonResult> task = Task.Run(() =>
            {
                var json_data = "";
                ApplicationUser user;
                try
                {
                    user = db.Users.Where(t => t.UserName == User.Identity.Name).FirstOrDefault();
                }
                catch (Exception)
                {
                    user = null;
                }
                if (user != null)
                {
                    
                }
                var appSettings = new AppSettings();
                List<Dictionary<string, List<string>>> list = new List<Dictionary<string, List<string>>>();
                list.Add(appSettings.EngVoices);
                list.Add(appSettings.RusVoices);
                json_data = JsonConvert.SerializeObject(list);
                
                return Json(json_data);
            });

            return await task;
        }

        public async Task<JsonResult> SetSettings(string en_voice, string ru_voice)
        {
            Task<JsonResult> task = Task.Run(() =>
            {
                var json_data = JsonConvert.SerializeObject(false);
                ApplicationUser user;
                if (db != null)
                {
                    user = db.Users.Where(t => t.UserName == User.Identity.Name).FirstOrDefault();
                    if (user != null)
                    {
                        user.EnVoiceName = en_voice;
                        user.RuVoiceName = ru_voice;
                        db.SaveChangesAsync();
                        json_data = JsonConvert.SerializeObject(true);
                    }
                }
                return Json(json_data);
            });
            return await task;
        }




    // GET: Book/Details/5
    public ActionResult BookDetails(int id)
        {
            return View();
        }

        // GET: Book/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Book/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Book/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Book/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Book/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Book/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}