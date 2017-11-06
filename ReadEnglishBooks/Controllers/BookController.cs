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

namespace ReadEnglishBooks.Controllers
{
    public class BookController : Controller
    {
        private static BookModel book;
        private string pageNumberTag = "<br/><div class='page-number'>";
        private string divTag = "</div>";
        private string pageCountTag = "<br/><div class='page-count' hidden>";

        // GET: Book
        public ActionResult BookView(string book_folder, string book_name)
        {
            if (book_folder != null && book_name != null)
            {
                book = new BookModel(Directory.GetCurrentDirectory() + "\\Assets\\" + book_folder + "\\" + book_name);
            }
            return View();
        }

        public JsonResult GetPage(int page)
        {
            List<string> pages = new List<string>();
            
            try
            {
                if (book != null && book.PagesArray.Count() > 0)
                {
                    pages.Add(String.Join(String.Empty, book.PagesArray.ElementAt(page - 1).ToArray()) + 
                        pageNumberTag +
                        (page) + 
                        divTag +
                        pageCountTag +
                        book.PagesArray.Count() +
                        divTag);
                }                
            }
            catch (ArgumentNullException)
            {
                pages.Add("Книга не найдена");
            }
            return Json(pages);
        }

        [HttpPost]
        public ActionResult GetTextFromClient(string text)
        {
            StringHelper strHelper = new StringHelper();
            Translator translator = new Translator();
            List<Word> words_list = new List<Word>();
            List<string> list = strHelper.splitByWords(text);
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