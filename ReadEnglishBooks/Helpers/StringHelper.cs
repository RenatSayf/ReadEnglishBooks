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
            string s = text;
            string pattern = @"[^\d\sa-zA-Zа-яёйА-ЯЁЙ-]";
            string target = "";
            Regex regex = new Regex(pattern);
            string withoutPunctuation = regex.Replace(s, target);
            var list = withoutPunctuation.Split(' ').ToList();
            var listDistinct = list.Distinct().ToList();
            listDistinct.RemoveAll((element) => element == "");
            return listDistinct;
        }
    }
}
