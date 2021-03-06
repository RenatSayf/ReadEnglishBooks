﻿using ReadEnglishBooks.Models;
using System;
using System.Collections.Generic;
using System.Data.Common;
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

        public SQLiteConnection SetConnectToBookDataBase(string dataBaseFolder, string dataBaseName)
        {
            var dbName = Directory.GetCurrentDirectory() + "\\Assets\\" + dataBaseFolder + "\\" + dataBaseName + ".db";
            return new SQLiteConnection(string.Format("Data Source={0};", dbName));
        }

        public async Task<int> AddpLabelToBookTable(string dataBaseFolder, string dataBaseName, string author, string header, string contents)
        {
            int res = -1;
            author = author.Replace("'", "''");
            header = header.Replace("'", "''");
            contents = contents.Replace("'", "''");
            string cmd = string.Format("INSERT OR REPLACE INTO Book(Author, Header, BookContent) VALUES('{0}', '{1}', '{2}')", author, header, contents);
            SQLiteConnection connection = SetConnectToBookDataBase(dataBaseFolder, dataBaseName);
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {
                connection.Open();
                await new SQLiteCommand("DELETE FROM Book", connection).ExecuteNonQueryAsync();
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

        public async Task<int> AddpPagesToBookTable(string dataBaseFolder, string dataBaseName, string[] pages)
        {
            int res = -1;
            string startCmd = string.Format(@"INSERT OR REPLACE INTO Book(BookPage) VALUES ");
            string endCmd = "";
            foreach (var item in pages)
            {
                endCmd += "('" + item.Replace("'", "''") + "'),";
            }
            var cmd = startCmd + endCmd.Trim(',');
            SQLiteConnection connection = SetConnectToBookDataBase(dataBaseFolder, dataBaseName);
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

        public async Task<int> AddEntiesToTable(List<Word> list)
        {
            int res = -1;
            string startCmd = string.Format(@"INSERT OR REPLACE INTO Words(Eng, Rus, is_repeat) VALUES ");
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

        public async Task<Word> GetWordFromTable(string enword)
        {
            enword = enword.Replace("'", "''");
            var cmd = "SELECT * FROM Words Where Eng='" + enword + "'";
            Word word = null;
            SQLiteConnection connection = SetConnectToDataBase();
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            List<string> list = new List<string>();
            try
            {
                connection.Open();
                var reader = await sqlitecommand.ExecuteReaderAsync();
                
                foreach (DbDataRecord record in reader)
                {
                    for (int i = 0; i < record.FieldCount; i++)
                    {
                        list.Add(record[i].ToString());
                    }
                }
                if (list.Count == 3)
                {
                    word = new Word { Eng = list.ElementAt(0), Rus = list.ElementAt(1), IsRepeat = true }; 
                }
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
            return word;
        }

        public async Task<List<Word>> GetWordsListAsync(string page)
        {
            StringHelper stringHelper = new StringHelper();
            var list = stringHelper.splitByWords(page);
            var cmd = "SELECT * FROM Words Where ";
            foreach (var item in list)
            {
                cmd += "Eng='" + item.Replace("'", "''") + "' OR ";
            }
            cmd = cmd.Trim(" OR".ToCharArray());
            SQLiteConnection connection = SetConnectToDataBase();
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            List<Word> wordsList = null;
            List<string> fieldList = new List<string>();
            try
            {
                connection.Open();
                var reader = await sqlitecommand.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    wordsList = new List<Word>();
                    foreach (DbDataRecord record in reader)
                    {
                        for (int i = 0; i < record.FieldCount; i++)
                        {
                            fieldList.Add(record[i].ToString());
                        }
                        wordsList.Add(new Word
                        {
                            Eng = fieldList.ElementAt(0),
                            Rus = fieldList.ElementAt(1),
                            IsRepeat = (fieldList.ElementAt(2) == "True") ? true : false
                        });
                        fieldList.Clear();
                    } 
                }
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

            return wordsList;
        }

        public async Task<string> GetBookPage(string db_folder, string db_name, int page_number)
        {
            string page = null;
            string cmd = string.Format("SELECT * FROM Book Where RowId = {0}", page_number + 1);
            SQLiteConnection connection = SetConnectToBookDataBase(db_folder, db_name);
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);

            try
            {
                connection.Open();
                var reader = await sqlitecommand.ExecuteReaderAsync();

                List<string> fieldList = new List<string>();
                if (reader.HasRows)
                {
                    foreach (DbDataRecord record in reader)
                    {
                        for (int i = 0; i < record.FieldCount; i++)
                        {
                            fieldList.Add(record[i].ToString());
                        }                        
                    }
                    page = fieldList.ElementAt(3);
                }
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

            return page;
        }




    }
}
