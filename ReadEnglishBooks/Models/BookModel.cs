using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Models
{
    public class BookModel
    {
        private IEnumerable<List<char>> pagesList;

        public BookModel(string path, int pageLength)
        {
            if (File.Exists(path))
            {
                string readText = File.ReadAllText(path);
                var charArr = readText.ToCharArray();
                var pageAmount = (int)Math.Ceiling(charArr.Length / (double)pageLength);
                pagesList = Enumerable.Range(0, pageAmount).Select(i => charArr.Skip(i * pageLength).Take(pageLength).ToList());
                

            }            
        }

        public IEnumerable<List<char>> PagesList
        {
            get => pagesList;
            set => pagesList = value;
        }
    }
}
