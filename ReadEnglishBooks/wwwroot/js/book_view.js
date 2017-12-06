var pageWordsObj;
var wordsArray = [];
var sentencesArray = [];
var arrayOfSeletion = [];
var sentencesIndex = 0;
var words_count = 0;
var current_page;
var first_load = true;
var learn_mode = "sentence";
var learn_by_sentence = "sentence";
var learn_by_paragraf = "paragraf";
var learn_by_page = "page";
var background_of_selected = "#b6ff00";
var background_of_hover = "#d6ddd7";
//===========================================================================================================
function getPage(page)
{
    $.ajax({
        type: 'GET',
        url: '/Book/GetPage?page=' + page,
        success: function (data)
        {
            $("#page").html(data[0]);
            $("#book-header").text($("#book-name").text());
            //var page_number = parseInt($(".page-number").text());
            var page_count = parseInt($(".page-count").text());
            if (data.length > 1)
            {
                pageWordsObj = jQuery.parseJSON(data[1]).Result;
            }
            if (first_load)
            {
                $("title").text($("#book-name").text());
            }

            $('#pagination-demo').twbsPagination({
                totalPages: page_count,
                visiblePages: 5,
                onPageClick: function (event, page)
                {
                    if (!first_load)
                    {
                        getPage(page);
                    }
                    first_load = false;
                }
            });
            page_HTML = document.getElementById("page").innerHTML;  
            addSpanTagToSentence();
            addSpanTagToParagraf();            
            sentenceEvents();
            current_page = page;
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: 'JSON'
    });
}
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
$('#btn-translate').click(function (e)
{
    e.preventDefault();
    var text = getSelectionText();
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
    if (data.length > 0 && data[0].message !== "Ok")
    {
        alert(data[0].message);
        return;
    }
    if (clean === true)
    {
        $("#words-table > tbody").empty();
    }

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
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: "json"        
    });
});
//===========================================================================================================
$("#btn-call-translate").click(function ()
{
    $("#translate-panel").modal("show");
});
//===========================================================================================================
$('#learn-mode').change(function ()
{
    learn_mode = $('#learn-mode').selectpicker('val');
    local_HTML = undefined;
    arrayOfSeletion.length = 0;
    $('#audio')[0].pause();
    speechStop();
    getPage(current_page);
});
//===========================================================================================================
function sentenceEvents()
{
    $(".sentence").hover(function ()
    {
        if (learn_mode === learn_by_sentence)
        {
            $(this).not(".clicked").css("background-color", background_of_hover);
        }
    },
        function ()
        {
            $(this).not(".clicked").removeAttr("style");
        }
    );

    $(".paragraf").hover(function ()
    {
        if (learn_mode === learn_by_paragraf)
        {
            $(this).not(".clicked").css("background-color", background_of_hover);
        }
    },
        function ()
        {
            $(this).not(".clicked").removeAttr("style");
        }
    );

    $(".book-page").hover(function ()
    {
        if (learn_mode === learn_by_page)
        {
            $(this).not(".clicked").css("background-color", background_of_hover);
        }
    },
        function ()
        {
            $(this).not(".clicked").removeAttr("style");
        }
    );

    $(".sentence").click(function ()
    {
        if (!isPlay)
        {
            $(".sentence").removeClass("clicked");
            $("span").removeClass("ru-word");
            if (learn_mode === learn_by_sentence)
            {
                words_count = 0;
                $(".sentence").removeAttr("style");
                $(this).css("background-color", background_of_selected).addClass("clicked");
                arrayOfSeletion = getSelectingWords(this.innerText);
                local_HTML = undefined;
            }
        }       
    });

    $(".paragraf").click(function ()
    {
        if (!isPlay)
        {
            $(".paragraf").removeClass("clicked");
            $("span").removeClass("ru-word");
            if (learn_mode === learn_by_paragraf)
            {
                words_count = 0;
                $(".paragraf").removeAttr("style");
                $(this).css("background-color", background_of_selected).addClass("clicked");
                arrayOfSeletion = getSelectingWords(this.innerText);
                local_HTML = undefined;
            }
        }
    });

    $(".book-page").click(function ()
    {
        if (!isPlay)
        {
            $(".book-page").removeClass("clicked");
            $("span").removeClass("ru-word");
            if (learn_mode === learn_by_page)
            {
                words_count = 0;
                $(".book-page").removeAttr("style");
                $(this).css("background-color", background_of_selected).addClass("clicked");
                arrayOfSeletion = getSelectingWords(this.innerText);
                local_HTML = undefined;
            }
        }
    });
}
//===========================================================================================================
var isPlay = false;
document.getElementById("fa_play").onmouseenter = function (event)
{
    if (!isPlay)
    {
        event.target.style.color = 'pink';
    }
}
document.getElementById("fa_play").onmouseleave = function (event)
{
    if (!isPlay)
    {
        event.target.style.color = '';
    }
}
document.getElementById("fa_play").onclick = function (event)
{    
    var w = arrayOfSeletion;
    if (arrayOfSeletion.length > 0 && words_count <= arrayOfSeletion.length - 1)
    {
        isPlay = true;
        $("#fa_play").hide();
        $("#fa_pause").show();
        speech(arrayOfSeletion[words_count]);
    }
    event.target.style.color = '';
}
//===========================================================================================================
$(document).ready(function ()
{
    getPage(1);           
});
//===========================================================================================================
window.onload = function ()
{
    var variant = $("#learn-mode").selectpicker('val', learn_mode);
    return;
}
//===========================================================================================================
function CreateAlert(divId, message)
{
    //debugger;
    var res = $(divId).append('<div class="alert alert-warning fade in">' +
        '<a data-dismiss="alert" href="#" class="close">×</a >' + message + '</div >');
    $(divId).slideDown();
}


