using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Speech.Synthesis;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Models
{
    public class AppSettings
    {
        public List<string> EngVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                List<string> list = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "en-US")
                    {
                        list.Add(voice.VoiceInfo.Name);
                    }
                }
                return list;
            }
        }

        public List<string> RusVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                List<string> list = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "ru-RU")
                    {
                        list.Add(voice.VoiceInfo.Name);
                    }
                }
                return list;
            }
        }
    }
}
