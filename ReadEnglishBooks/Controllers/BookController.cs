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
                pages.Add(" нига не найдена");
            }
            return Json(pages);
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