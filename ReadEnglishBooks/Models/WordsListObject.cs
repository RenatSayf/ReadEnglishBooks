using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Models
{
    public class WordsListObject
    {
        public int code { get; set; }
        public string lang { get; set; }
        public List<Word> wordsList { get; set; }
    }
}
