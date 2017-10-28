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
        public async Task<Word> GetTranslateFromYandexAsync(string text)
        {
            WebClient client = new WebClient();
            text = text.ToLower();
            text = WebUtility.UrlEncode(text);
            string lang = "";
            if (text.Any(wordByte => wordByte <= 122))
            {
                lang = "en-ru";
            }
            else if (text.Any(wordByte => wordByte >= 1040 && wordByte <= 1103))
            {
                lang = "ru-en";
            }
            else
            {
                return null;
            }

            string keyApi = "trnsl.1.1.20160128T151725Z.d4bbd1b06137bfde.2e1323688363a820f730629556d68f2b9f0a1a19";
            string format = "plain";
            string url = "https://translate.yandex.net/api/v1.5/tr/translate?key=" + keyApi + "&text=" + text + "&lang=" + lang + "&[format=" + format + "]&[options=1]";

            Uri uri = new Uri(url);

            string stringData = "";
            try
            {
                Stream data = await client.OpenReadTaskAsync(uri);
                StreamReader reader = new StreamReader(data);
                stringData = reader.ReadToEnd();
                data.Close();
                reader.Close();
            }
            catch (Exception err)
            {
                Debug.WriteLine(err.Message);
                return null;
            }
            List<string> list = new List<string>();
            Word word = new Word();

            XmlDocument docXml = new XmlDocument();
            docXml.LoadXml(stringData);
            foreach (XmlNode node in docXml.SelectNodes("Translation"))
            {
                foreach (XmlNode item in node.ChildNodes)
                {
                    list.Add(item.InnerText);
                    if (item.InnerText.Where(wordbyte => wordbyte > 64).Any(wordByte => wordByte <= 122))
                    {
                        word.Eng = item.InnerText;
                        word.Rus = text;
                        word.IsRepeat = true;
                        break;
                    }
                    else if (item.InnerText.Where(wordbyte => wordbyte > 64).Any(wordByte => wordByte >= 1040 && wordByte <= 1103 || wordByte == 1105))
                    {
                        word.Eng = text;
                        word.Rus = item.InnerText;
                        word.IsRepeat = true;
                        break;
                    }
                    else
                    {
                        word = null;
                        break;
                    }
                }
            }
            return word;
        }

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
                text += "&text=" + WebUtility.UrlEncode(item); ;
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

        public Word GetTranslateFromYandex(string text)
        {
            double all_char_count = text.Length;
            double en_char_count = text.Where(wordByte => wordByte < 123 && wordByte > 64).Count();
            double ru_char_count = text.Where(wordByte => wordByte < 1106 && wordByte > 1039).Count();
            double digit_char_count = text.Where(wordByte => wordByte < 58 && wordByte > 47).Count();
            text = text.ToLower();
            string lang = "";
            if (en_char_count > ru_char_count && (ru_char_count / en_char_count) * 100 < 30)
            {
                lang = "en-ru";
            }
            else if (en_char_count < ru_char_count && (en_char_count / ru_char_count) * 100 < 30)
            {
                lang = "ru-en";
            }
            else if (en_char_count == 0 && ru_char_count == 0 && digit_char_count > 0)
            {
                lang = "en-ru";
            }
            else
            {
                return new Word()
                {
                    Eng = "Error: class Translator -> GetTranslateFromYandex -> lang = null",
                    Rus = null,
                    IsRepeat = false
                };
            }
            text = WebUtility.UrlEncode(text);
            string keyApi = "trnsl.1.1.20160128T151725Z.d4bbd1b06137bfde.2e1323688363a820f730629556d68f2b9f0a1a19";
            string keyApi2 = "trnsl.1.1.20160607T122324Z.85a9ab6b9e12baac.f5b66628231eb6175c5cf1393d1601c2cfb5d553";
            string keyApi3 = "trnsl.1.1.20170126T141135Z.59c382f4c439bbaf.3226485ac0b3691894625bddb3c48c74f5067706";
            string format = "plain";
            string url = "https://translate.yandex.net/api/v1.5/tr/translate?key=" + keyApi3 + "&text=" + text + "&lang=" + lang + "&[format=" + format + "]&[options=1]";

            Uri uri = new Uri(url);
            WebClient client = new WebClient();
            client.Encoding = Encoding.UTF8;
            string stringData = "";
            try
            {
                Stream data = client.OpenRead(uri);
                StreamReader reader = new StreamReader(data);
                stringData = reader.ReadToEnd();
                //data.Close();
                reader.Close();
            }
            catch (Exception err)
            {
                Debug.WriteLine(err.Message);
                return new Word()
                {
                    Eng = err.Message,
                    Rus = null,
                    IsRepeat = false
                };
            }
            List<string> list = new List<string>();
            Word word = new Word();

            XmlDocument docXml = new XmlDocument();
            docXml.LoadXml(stringData);
            var status = docXml.SelectNodes("Translation").Item(0).Attributes.Item(0).InnerText;
            if (status == null)
            {
                return new Word()
                {
                    Eng = "Error: class Translator -> GetTranslateFromYandex -> XmlDocument -> var status=null",
                    Rus = null,
                    IsRepeat = false
                };
            }
            else
            {
                switch (status)
                {
                    case "200":
                        word.Error = 200;
                        break;
                    case "400":
                        word.Error = 400;
                        break;
                    case "401":
                        word.Error = 401;
                        break;
                    case "402":
                        word.Error = 402;
                        break;
                    case "404":
                        word.Error = 404;
                        break;
                    case "413":
                        word.Error = 413;
                        break;
                    case "422":
                        word.Error = 422;
                        break;
                    case "501":
                        word.Error = 501;
                        break;
                    default:
                        word.Error = -1;
                        break;
                }
            }

            foreach (XmlNode node in docXml.SelectNodes("Translation"))
            {
                foreach (XmlNode item in node.ChildNodes)
                {
                    list.Add(item.InnerText);
                    if (item.InnerText.Where(wordbyte => wordbyte > 64).Any(wordByte => wordByte <= 122))
                    {
                        word.Eng = WebUtility.UrlDecode(item.InnerText);
                        word.Rus = WebUtility.UrlDecode(text);
                        word.IsRepeat = true;
                        break;
                    }
                    else if (item.InnerText.Where(wordbyte => wordbyte > 64).Any(wordByte => wordByte >= 1040 && wordByte <= 1103 || wordByte == 1105))
                    {
                        word.Eng = WebUtility.UrlDecode(text);
                        word.Rus = WebUtility.UrlDecode(item.InnerText);
                        word.IsRepeat = true;
                        break;
                    }
                    else if (item.InnerText.All(wordbyte => wordbyte < 65))
                    {
                        word.Eng = WebUtility.UrlDecode(text);
                        word.Rus = WebUtility.UrlDecode(text);
                        word.IsRepeat = true;
                        break;
                    }
                    else
                    {
                        word = new Word()
                        {
                            Eng = "Error: class Translator -> GetTranslateFromYandex -> XmlNode item in node.ChildNodes",
                            Rus = null,
                            IsRepeat = false
                        };
                        break;
                    }
                }
            }
            return word;
        }




    }

    //=============================================================================================
    public class Head
    {
        public bool more { get; set; }
    }

    public class Syn
    {
        public string text { get; set; }
        public string pos { get; set; }
        public string asp { get; set; }
    }

    public class Mean
    {
        public string text { get; set; }
    }

    public class Tr2
    {
        public string text { get; set; }
    }

    public class Ex
    {
        public string text { get; set; }
        public List<Tr2> tr { get; set; }
    }

    public class Tr
    {
        public string text { get; set; }
        public string pos { get; set; }
        public string asp { get; set; }
        public List<Syn> syn { get; set; }
        public List<Mean> mean { get; set; }
        public List<Ex> ex { get; set; }
    }

    public class Def
    {
        public string text { get; set; }
        public string pos { get; set; }
        public string ts { get; set; }
        public List<Tr> tr { get; set; }
    }

    public class RootObject
    {
        public Head head { get; set; }
        public List<Def> def { get; set; }
    }
}

