var wordsArray = [];
var sentencesArray = [];
var arrayOfSeletion = [];
var sentencesIndex = 0;
var words_count = 0;
var first_load = true;
//===========================================================================================================
document.getElementById("btn-learn-all").onclick = function ()
{
    var sentences = "";
    sentencesArray.length = 0;
    arrayOfSeletion.length = 0;
    words_count = 0;
    $("h2, h3, p").each(function (i)
    {
        sentences += $(this).text() + " ";
    });
    wordsArray = getSelectingWords(sentences);
    //sentencesIndex = 0;
};
//===========================================================================================================
$("#btn-learn").click(function ()
{
    words_count = 0;
    wordsArray.length = 0;
    arrayOfSeletion.length = 0;
    //sentencesIndex = 0;
    var tempArray = getWordsBySentences();    
    for (var i = 0; i < tempArray.length; i++)
    {
        if (tempArray[i].length > 0)
        {
            sentencesArray.push(tempArray[i]);
        }
    }
    tempArray = [];
    //debugger;
});
//===========================================================================================================
$("#btn-learn-select").click(function ()
{
    words_count = 0;
    //debugger;
    if (arrayOfSeletion.length === 0)
    {
        $("#dialog-message").dialog({
            modal: false,
            dialogClass: 'custom-ui-widget-header-warning',
            buttons: {
                Ok: function ()
                {
                    $(this).dialog("close");
                }
            }
        });
        return;
    }
    $("#play-panel").modal("show");
});
//===========================================================================================================
function getPage(page)
{
    //debugger;
    $.ajax({
        type: 'GET',
        url: '/Book/GetPage?page=' + page,
        success: function (data)
        {
            $("#page").html(data[0]);
            $("#book-header").text($("#book-name").text());
            //var page_number = parseInt($(".page-number").text());
            var page_count = parseInt($(".page-count").text());

            if (first_load)
            {
                $("title").text($("#book-name").text());
            }

            $('#pagination-demo').twbsPagination({
                totalPages: page_count,
                visiblePages: 5,
                onPageClick: function (event, page)
                {
                    //debugger;
                    if (!first_load)
                    {
                        //debugger;
                        getPage(page);
                    }
                    first_load = false;
                }
            });
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: 'JSON'
    });
}
//===========================================================================================================
document.getElementById("btn-back").onclick = function ()
{
    alert("btn-back is click");
};
//===========================================================================================================
$("#btn-start").click(function ()
{
    $("#div-start").attr("hidden", "hidden");
    $("#div-stop").removeAttr("hidden");
    if (wordsArray.length > 0 && words_count <= wordsArray.length - 1)
    {
        speech(wordsArray[words_count]);
    }

    if (sentencesArray.length > 0 && words_count <= sentencesArray[sentencesIndex].length)
    {
        //var sent = sentencesArray[sentencesIndex][words_count];
        //debugger;
        speech(sentencesArray[sentencesIndex][words_count]);
    }
    if (arrayOfSeletion.length > 0 && words_count <= arrayOfSeletion.length - 1)
    {
        speech(arrayOfSeletion[words_count]);
    }
});  
//===========================================================================================================
$("#btn-stop").click(function ()
{
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
    $("#audio")[0].pause();
});
//===========================================================================================================
$("#btn-next").on("click", function ()
{
    alert("btn-next is click");
});

//===========================================================================================================
document.getElementById("page").onclick = function ()
{
    wordsArray.length = 0;
    sentencesArray.length = 0;
    arrayOfSeletion = getSelectingWords(getSelectionText());
    //debugger;
    if (arrayOfSeletion.length > 0)
    {
        $('#select-text').text(getSelectionText());
        //$("#translate-panel").modal("show");
    }

};
//===========================================================================================================
$('#btn-translate').click(function (e)
{
    e.preventDefault();
    var text = getSelectionText();
    //debugger;
    if (text === '')
    {
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/Book/GetTextFromClient?text=' + text,
        success: function (data)
        {
            $("#translate-panel").modal("hide");
            $("#words-panel").modal("show");
            //debugger;
            updateWordsTable(data, true);
            
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: 'JSON'
    });
});
//===========================================================================================================
function updateWordsTable(data, clean)
{
    //debugger;
    if (data.length > 0 && data[0].message !== "Ok")
    {
        alert(data[0].message);
        return;
    }
    if (clean === true)
    {
        $("#words-table > tbody").empty();
    }

    //debugger;
    for (var i = 0; i < data.length; i++)
    {
        $("#words-table > tbody").append('<tr class="word-tr">' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + decodeURIComponent(data[i].english) + '</td>' +
            '<td>' + '<input type="text" value="' + decodeURIComponent(data[i].translate) + '" />' + '</td>' +
            '<td>' + '<input class="btn-remove" type="button" value="Удалить" />' + '</td>' +
            '</tr>');
    }   
    $('.btn-remove').click(DeleteRow);
}
//===========================================================================================================
function DeleteRow()
{
    $(this).parents('tr').first().remove();
}
//===========================================================================================================
$('#btn-save').click(function ()
{
    var data = $('table tr:gt(0)').map(function ()
    {
        return{
            eng: $(this.cells[1]).text(),
            rus: this.cells[2].children[0].value, 
            isrepeat: true
        };
    }).get();
    
    $.ajax({
        type: "POST",
        url: "/Book/GetWordsFromClient",
        data: "data=" + JSON.stringify(data),
        success: function (response)
        {
            //$("#words-panel").modal("hide");
            var message = response.message;
            var res = parseInt(response.res);
            if (message === "Ok" && res >= 0)
            {
                alert("Слова успешно записаны в БД");
            }
            if (message === "Ok" && res < 0)
            {
                alert("Не удалось записать слова в БД");
            }
            //debugger;
        },
        error: function (xhr, status, error)
        {
            //debugger;
            //$("#words-panel").modal("hide");
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: "json"        
    });
});
//===========================================================================================================





//===========================================================================================================
$(document).ready(function ()
{
    getPage(1);

    
});

function CreateAlert(divId, message)
{
    //debugger;
    var res = $(divId).append('<div class="alert alert-warning fade in">' +
        '<a data-dismiss="alert" href="#" class="close">×</a >' + message + '</div >');
    $(divId).slideDown();
}
