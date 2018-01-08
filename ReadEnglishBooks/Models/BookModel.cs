using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ReadEnglishBooks.Models
{
    public class BookModel
    {
        private string book_name;
        private string author;
        private string book_contents;
        private string[] pagesArray;

        public BookModel(string path)
        {
            if (File.Exists(path))
            {
                string readText = File.ReadAllText(path);
                string result = string.Join(" ", readText.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
                var book_array = result.Split('}');
                pagesArray = book_array[2].Split('|');
                var book_header_arr = book_array[0].Split('.');
                book_name = book_header_arr[0].Trim();
                author = book_header_arr[1].Trim();
                book_contents = book_array[1].Trim();
            }
        }
        
        public string BookName
        {
            get => book_name;
        }

        public string Author
        {
            get => author;
        }

        public string BookContents
        {
            get => book_contents;
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
