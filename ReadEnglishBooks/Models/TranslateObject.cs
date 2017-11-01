using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Models
{
    public class TranslateObject
    {
        public int code { get; set; }
        public string lang { get; set; }
        public List<string> eng { get; set; }
        public List<string> rus { get; set; }
    }
}
