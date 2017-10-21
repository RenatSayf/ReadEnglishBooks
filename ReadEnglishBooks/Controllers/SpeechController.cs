using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Speech.Synthesis;

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

        public async Task<ActionResult> Speak(string enword)
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
                            }
                        }
                        synth.Speak(enword);

                        //foreach (var item in voices)
                        //{
                        //    if (item.Enabled && item.VoiceInfo.Culture.Name == "ru-RU")
                        //    {
                        //        synth.SelectVoice(item.VoiceInfo.Name);
                        //    }
                        //}
                        //synth.Speak(ruword);

                        byte[] bytes = stream.GetBuffer();
                        return File(bytes, "audio/x-wav");
                    }
                }
            });

            return await task;
        }

    }
}
