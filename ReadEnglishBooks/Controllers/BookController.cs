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
        private string pageCountTag = "<br/><div class='page-count' hidden>";

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
            if (book_name != null)
            {
                book = new BookModel(Directory.GetCurrentDirectory() + "\\Assets\\" + book_name, 5000); 
            }
            List<string> pages = new List<string>();
            
            try
            {
                if (book.PagesList.Count() > 0)
                {
                    pages.Add(String.Join(String.Empty, book.PagesList.ElementAt(page - 1).ToArray()) + 
                        pageNumberTag +
                        (page) + 
                        divTag +
                        pageCountTag +
                        book.PagesList.Count() +
                        divTag);
                }                
            }
            catch (ArgumentNullException)
            {
                pages.Add("����� �� �������");
            }
            return Json(pages);
        }

        public JsonResult GetNextPage(int page)
        {
            List<string> nextPage = new List<string>();
            if (page >=0 || page <= book.PagesList.Count() - 1)
            {
                nextPage.Add(String.Join(String.Empty, book.PagesList.ElementAt(page+2).ToArray()) + pageNumberTag + (page+2) + divTag); 
            }
            return Json(nextPage);
        }

        public JsonResult GetPreviousPage(int page)
        {
            List<string> nextPage = new List<string>();
            if (page >= 0 || page <= book.PagesList.Count() - 1)
            {
                nextPage.Add(String.Join(String.Empty, book.PagesList.ElementAt(page - 2).ToArray()) + pageNumberTag + (page - 2) + divTag);
            }
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