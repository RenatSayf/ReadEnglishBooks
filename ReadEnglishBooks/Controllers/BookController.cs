using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReadEnglishBooks.Models;
using System.IO;
using System.Collections.Generic;

namespace ReadEnglishBooks.Controllers
{
    public class BookController : Controller
    {
        private static BookModel book;
        private string pageNumberTag = "<br/><div class='page-number'>";
        private string divTag = "</div>";
        
        // GET: Book
        public ActionResult BookView(int page)
        {
            ViewBag.title = "1984. George Orwell";
            //book = new BookModel(Directory.GetCurrentDirectory() + "\\Assets\\1984.txt", 2000);
            //ViewBag.page0 = String.Join(String.Empty, book.PagesList.ElementAt(0).ToArray());
            return View();
        }

        public JsonResult GetFirstPages(string book_name, int page)
        {
            book = new BookModel(Directory.GetCurrentDirectory() + "\\Assets\\" + book_name, 4000);
            List<string> pages = new List<string>();
            
            try
            {
                if (page == 0 && book.PagesList.Count() > 2)
                {
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page).ToArray()) + pageNumberTag + 1 + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 1).ToArray()) + pageNumberTag + 2 + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 2).ToArray()) + pageNumberTag + 3 + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 3).ToArray()) + pageNumberTag + 4 + divTag);

                }
                if (page > 0 && page < 2 && book.PagesList.Count() > 2)
                {
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page).ToArray()) + pageNumberTag + (page + 1) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 1).ToArray()) + pageNumberTag + (page + 2) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 2).ToArray()) + pageNumberTag + (page + 3) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 3).ToArray()) + pageNumberTag + (page + 4) + divTag);
                }
                if (page >= 2 && book.PagesList.Count() > 2)
                {
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page).ToArray()) + pageNumberTag + (page + 1) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 1).ToArray()) + pageNumberTag + (page + 2) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 2).ToArray()) + pageNumberTag + (page + 3) + divTag);
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page + 3).ToArray()) + pageNumberTag + (page + 4) + divTag);
                }
            }
            catch (ArgumentNullException)
            {
                pages.Add(" нига не найдена");
            }
            return Json(pages);
        }

        public JsonResult GetNextPage(int page)
        {
            List<string> nextPage = new List<string>();
            nextPage.Add(String.Join(String.Empty, book.PagesList.ElementAt(page).ToArray()) + pageNumberTag + 1 + divTag);
            return Json(nextPage);
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