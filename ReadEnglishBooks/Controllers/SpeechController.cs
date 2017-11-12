using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Speech.Synthesis;
using ReadEnglishBooks.Helpers;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReadEnglishBooks.Controllers
{
    public class SpeechController : Controller
    {
        // GET: /<controller>/
        //public IActionResult Index()
        //{
        //    return View();
        //}

        public async Task<ActionResult> Speech(string enword, string ruword)
        {
            Task<FileContentResult> task = Task.Run(() =>
            {
                using (var synth = new SpeechSynthesizer())
                {
                    var voices = synth.GetInstalledVoices();

                    using (var stream = new MemoryStream())
                    {
                        synth.SetOutputToWaveStream(stream);

                        foreach (var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "en-US")
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                break;
                            }
                        }
                        synth.Speak(enword);

                        foreach (var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "ru-RU")
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                break;
                            }
                        }
                        if (ruword != null)
                        {
                            synth.Speak(ruword); 
                        }

                        foreach(var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "en-US")
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                break;
                            }
                        }
                        synth.Speak(enword);

                        byte[] bytes = stream.GetBuffer();
                        var f = File(bytes, "audio/x-wav");
                        return File(bytes, "audio/x-wav");
                    }
                }
            });

            return await task;
        }

        public async Task<JsonResult> SendWordsToClient(string enword)
        {
            SqliteHelper sqliteHelper = new SqliteHelper();
            var word = await sqliteHelper.GetWordFromTable(enword);
            var json_data = JsonConvert.SerializeObject(word);
            return Json(json_data);
        }
        
    }
}
