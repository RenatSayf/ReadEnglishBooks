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
            string withoutTag = Regex.Replace(str, "<[^>]*>", string.Empty);
            string withoutNewLine = Regex.Replace(withoutTag, "[\t\n\r]", string.Empty);            
            string withoutPunctuation = Regex.Replace(withoutNewLine, @"[^\d\s'a-zA-Zа-яёйА-ЯЁЙ-]/gmi", " ");
            var list = withoutPunctuation.Split(' ','.',',','!','?',':',';').ToList();
            var listDistinct = list.Distinct().ToList();
            listDistinct.RemoveAll((element) => element == "" || element == "'" || element == "," || element == "." || element == "-");
            return listDistinct;
        }
    }
}
