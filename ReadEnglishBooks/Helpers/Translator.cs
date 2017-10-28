using Newtonsoft.Json;
using ReadEnglishBooks.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ReadEnglishBooks.Helpers
{
    public class Translator
    {
        public List<Word> GetTranslateFromYandex(List<string> list)
        {
            List<Word> words_list = null;
            TranslateObject translateObject;
            string keyApi = "trnsl.1.1.20170126T141135Z.59c382f4c439bbaf.3226485ac0b3691894625bddb3c48c74f5067706";
            string format = "plain";
            string lang = "en-ru";
            string text = "";
            foreach (var item in list)
            {
                text += "&text=" + WebUtility.UrlEncode(item);
            }
            string url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + keyApi + text + "&lang=" + lang + "&[format=" + format + "]&[options=1]";
            Uri uri = new Uri(url);
            WebClient client = new WebClient
            {
                Encoding = Encoding.UTF8
            };
            string stringData = "";
            try
            {
                Stream data = client.OpenRead(uri);
                StreamReader reader = new StreamReader(data);
                stringData = reader.ReadToEnd();
                reader.Close();
                translateObject = JsonConvert.DeserializeObject<TranslateObject>(stringData);
                if (translateObject != null && list.Count == translateObject.text.Count)
                {
                    words_list = new List<Word>();
                    for (int i = 0; i < list.Count; i++)
                    {
                        words_list.Add(new Word
                        {
                            Error = translateObject.code,
                            Eng = list.ElementAt(i),
                            Rus = translateObject.text.ElementAt(i),
                            IsRepeat = true
                        });
                    }
                }
            }
            catch (Exception err)
            {
                Debug.WriteLine(err.Message);

            }
            return words_list;
        }

    }   
}

