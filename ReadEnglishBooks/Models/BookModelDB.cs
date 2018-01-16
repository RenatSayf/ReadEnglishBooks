using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ReadEnglishBooks.Models
{
    public class BookModelDB
    {
        private string book_folder;
        private string book_name;
        private SQLiteConnection connection;

        public BookModelDB(string book_folder, string book_name)
        {
            if (book_folder != null || book_name != null)
            {
                var dbName = Directory.GetCurrentDirectory() + "\\Assets\\" + book_folder + "\\" + book_name + ".db";
                connection = new SQLiteConnection(string.Format("Data Source={0};", dbName));
                this.book_folder = book_folder;
                this.book_name = book_name + ".db"; 
            }
        }

        public async Task<string> getBookAuthor()
        {
            object author = null;
            string cmd = string.Format("SELECT Author FROM Book Where RowId = 1");
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {
                
                connection.Open();
                author = await sqlitecommand.ExecuteScalarAsync();
                return author.ToString();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return author.ToString();
            }
            finally
            {
                connection.Close(); //закрываем базу
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }
        }

        public async Task<string> getBookHeader()
        {
            object header = null;
            string cmd = string.Format("SELECT Header FROM Book Where RowId = 1");
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {

                connection.Open();
                header = await sqlitecommand.ExecuteScalarAsync();
                return header.ToString();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return header.ToString();
            }
            finally
            {
                connection.Close(); //закрываем базу
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }
        }

        public async Task<string> getBookContents()
        {
            object contents = null;
            string cmd = string.Format("SELECT BookContent FROM Book Where RowId = 1");
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {

                connection.Open();
                contents = await sqlitecommand.ExecuteScalarAsync();
                return contents.ToString();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return contents.ToString();
            }
            finally
            {
                connection.Close(); //закрываем базу
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }
        }

        public async Task<string> getBookPage(int page_number)
        {
            object page = null;
            string cmd = string.Format("SELECT BookPage FROM Book Where RowId = {0}", page_number + 1);
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {

                connection.Open();
                page = await sqlitecommand.ExecuteScalarAsync();
                return page.ToString();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return page.ToString();
            }
            finally
            {
                connection.Close(); //закрываем базу
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }
        }

        public int getPageCount()
        {
            int count = 0;
            string cmd = string.Format("SELECT COUNT(BookPage) FROM Book");
            SQLiteCommand sqlitecommand = new SQLiteCommand(cmd, connection);
            try
            {

                connection.Open();
                var countStr = sqlitecommand.ExecuteScalar();
                var c = int.Parse(countStr.ToString());
                return int.Parse(countStr.ToString());
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return count;
            }
            finally
            {
                connection.Close(); //закрываем базу
                if (sqlitecommand != null) sqlitecommand.Dispose();
            }
        }
    }
}
