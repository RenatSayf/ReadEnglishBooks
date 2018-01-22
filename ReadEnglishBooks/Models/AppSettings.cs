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
        private static AppSettings instance;
        private static object syncRoot = new Object(); 

        protected AppSettings()
        {

        }

        public static AppSettings GetInstance()
        {
            if (instance == null)
            {
                lock (syncRoot)
                {
                    if (instance == null)
                    {
                        instance = new AppSettings(); 
                    } 
                }
            }
            return instance;
        }

        public List<string> EngVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                List<string> voicesList = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "en-US")
                    {
                        voicesList.Add(voice.VoiceInfo.Name);
                    }
                }
                
                return voicesList;
            }
        }

        public List<string> RusVoices
        {
            get
            {
                var voices = new SpeechSynthesizer().GetInstalledVoices();
                List<string> voicesList = new List<string>();
                List<string> list = new List<string>();
                foreach (var voice in voices)
                {
                    if (voice.Enabled && voice.VoiceInfo.Culture.Name == "ru-RU")
                    {
                        voicesList.Add(voice.VoiceInfo.Name);                       
                    }
                }
                return voicesList;
            }
        }
    }
}
