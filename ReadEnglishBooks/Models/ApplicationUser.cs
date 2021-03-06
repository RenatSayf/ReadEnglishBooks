﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace ReadEnglishBooks.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string BookName { get; set; }
        public int Bookmark { get; set; }
        public string EnVoiceName { get; set; }
        public string RuVoiceName { get; set; }
        public string EnVoiceRate { get; set; }
        public string RuVoiceRate { get; set; }
        
    }
}
