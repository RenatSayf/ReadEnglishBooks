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

        public async Task<ActionResult> Speech(string enWord,
                                               string ruWord, 
                                               string enVoice, 
                                               string ruVoice,
                                               string enRate,
                                               string ruRate)
        {
            Task<FileContentResult> task = Task.Run(() =>
            {
                using (var synth = new SpeechSynthesizer())
                {
                    var voices = synth.GetInstalledVoices();
                    
                    using (var stream = new MemoryStream())
                    {
                        int enRateOut, ruRateOut;
                        switch (enRate)
                        {
                            case "fast":
                                enRateOut = 5;
                                break;
                            case "slow":
                                enRateOut = -5;
                                break;
                            default:
                                enRateOut = 0;
                                break;
                        }
                        switch (ruRate)
                        {
                            case "fast":
                                ruRateOut = 5;
                                break;
                            case "slow":
                                ruRateOut = -5;
                                break;
                            default:
                                ruRateOut = 0;
                                break;
                        }
                        synth.SetOutputToWaveStream(stream);
                        foreach (var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "en-US" && item.VoiceInfo.Name == enVoice)
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                synth.Rate = enRateOut;
                                break;
                            }
                        }
                        synth.Speak(enWord);

                        foreach (var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "ru-RU" && item.VoiceInfo.Name == ruVoice)
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                synth.Rate = ruRateOut;
                                break;
                            }
                        }
                        if (ruWord != null && enWord.ToLower() != "the" && enWord.ToLower() != "a" && enWord.ToLower() != "an")
                        {
                            synth.Speak(ruWord); 
                        }

                        foreach(var item in voices)
                        {
                            if (item.Enabled && item.VoiceInfo.Culture.Name == "en-US" && item.VoiceInfo.Name == enVoice)
                            {
                                synth.SelectVoice(item.VoiceInfo.Name);
                                synth.Rate = enRateOut;
                                break;
                            }
                        }
                        synth.Speak(enWord);

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

        public async Task<JsonResult> GetVoiceList()
        {
            Task<JsonResult> task = Task.Run(() =>
            {
                var json_data = "";
                using (var synth = new SpeechSynthesizer())
                {
                    var voicesList = synth.GetInstalledVoices();
                    
                    foreach (var voice in voicesList)
                    {
                        json_data += JsonConvert.SerializeObject(voice.VoiceInfo.AdditionalInfo);
                    }
                }
                return Json(json_data);
            });

            return await task;
        }


        
    }
}
