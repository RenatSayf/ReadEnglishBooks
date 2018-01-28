using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReadEnglishBooks.Data.Migrations
{
    public partial class AddColumnsRates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EnVoiceRate",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RuVoiceRate",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnVoiceRate",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RuVoiceRate",
                table: "AspNetUsers");
        }
    }
}
