using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ReadEnglishBooks.Models
{
    public class BookModel
    {
        private string[] pagesArray;

        public BookModel(string path)
        {
            if (File.Exists(path))
            {
                string readText = File.ReadAllText(path);
                string result = string.Join(" ", readText.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
                char[] spliter = { '|' };
                string str = readText;
                pagesArray = result.Split(spliter);            
            }

        }            
        
        public string[] PagesArray
        {
            get => pagesArray;
        }

        public int PagesCount
        {
            get => pagesArray.Count();
        }
    }
}
