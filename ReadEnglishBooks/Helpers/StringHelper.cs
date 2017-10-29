using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Helpers
{
    public class StringHelper
    {
        public List<string> splitByWords(string text)
        {
            string str = text.ToLower();
            string pattern = @"[^\d\s'a-zA-Zа-яёйА-ЯЁЙ-]/gmi";
            string target = " ";
            Regex regex = new Regex(pattern);
            string withoutPunctuation = regex.Replace(str, target);
            var list = withoutPunctuation.Split(' ','.',',','!','?',':',';').ToList();
            var listDistinct = list.Distinct().ToList();
            listDistinct.RemoveAll((element) => element == "" || element == "'");
            return listDistinct;
        }
    }
}
