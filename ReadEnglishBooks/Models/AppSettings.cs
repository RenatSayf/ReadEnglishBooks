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
        public Dictionary<string, List<string>> EngVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                Dictionary<string, List<string>> voicesList = new Dictionary<string, List<string>>();
                List<string> list = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "en-US")
                    {
                        list.Add(voice.VoiceInfo.Name);
                    }
                }
                voicesList.Add("en_voices", list);
                return voicesList;
            }
        }

        public Dictionary<string, List<string>> RusVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                Dictionary<string, List<string>> voicesList = new Dictionary<string, List<string>>();
                List<string> list = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "ru-RU")
                    {
                        list.Add(voice.VoiceInfo.Name);                       
                    }
                }
                voicesList.Add("ru_voices", list);
                return voicesList;
            }
        }
    }
}
