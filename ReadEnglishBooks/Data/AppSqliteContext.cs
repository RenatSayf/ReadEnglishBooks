using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using System.IO;
using ReadEnglishBooks.Models;

namespace ReadEnglishBooks.Data
{
    public class AppSqliteContext : DbContext
    {
        private static string dbName = Directory.GetCurrentDirectory() + "\\Assets\\lexicon_DB.db";

        public AppSqliteContext() : base(dbName)
        {

        }

        public DbSet<Word> Words { get; set; }
    }
}
