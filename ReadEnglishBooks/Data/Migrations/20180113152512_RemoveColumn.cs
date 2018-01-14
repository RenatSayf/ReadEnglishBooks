using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReadEnglishBooks.Data.Migrations
{
    public partial class RemoveColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn("BookMark", "AspNetUsers", null);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
