using ReadEnglishBooks.Models;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Helpers
{
    public class SqliteHelper
    {


        public SQLiteConnection SetConnectToDataBase()
        {
            var dbName = Directory.GetCurrentDirectory() + "\\Assets\\WordsDB.db";
            return new SQLiteConnection(string.Format("Data Source={0};", dbName));
        }

        public async Task<int> AddEntiesToTable(List<Word> list)
        {
            int res = -1;
            string startCmd = string.Format(@"INSERT OR IGNORE INTO Words(Eng, Rus, is_repeat) VALUES ");
            string endCmd = "";
            foreach (var item in list)
            {
                endCmd += "('" + item.Eng.Replace("'","''") + "','" + item.Rus.Replace("'", "''") + "'," + 1 + "),";
            }
            var cmd = startCmd + endCmd.Trim(',');
            SQLiteConnection connection = SetConnectToDataBase();
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {
                connection.Open();
                res = await sqlitecommand.ExecuteNonQueryAsync();                
            }
            catch (Exception err)
            {
                Debug.WriteLine(err.Message);
            }
            finally
            {
                connection.Close(); //закрываем базу
                //if (connection != null) connection.Dispose();
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }

            return res;
        }



    }
}
