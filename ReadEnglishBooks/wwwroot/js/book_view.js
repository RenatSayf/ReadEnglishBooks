var pageWordsObj;
var wordsArray = [];
var sentencesArray = [];
var arrayOfSeletion = [];
var sentencesIndex = 0;
var words_count = 0;
var first_load = true;
var learn_mode = "sentence";
var learn_by_sentence = "sentence";
var learn_by_paragraf = "paragraf";
var learn_by_page = "page";
var background_of_selected = "#b6ff00";
var background_of_hover = "#d6ddd7";
//===========================================================================================================
//$("#btn-learn-select").click(function ()
//{
//    words_count = 0;
//    //debugger;
//    if (arrayOfSeletion.length === 0)
//    {
//        $("#dialog-message").dialog({
//            modal: false,
//            dialogClass: 'custom-ui-widget-header-warning',
//            buttons: {
//                Ok: function ()
//                {
//                    $(this).dialog("close");
//                }
//            }
//        });
//        return;
//    }
//    //findOnPage(getSelectionText(), "page");
//    findSentenceOnPage(getSelectionText(), "page");
//    $("#play-panel").modal("show");
//});
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
                    //debugger;
                    if (!first_load)
                    {
                        //debugger;
                        getPage(page);
                    }
                    first_load = false;
                }
            });
            page_HTML = document.getElementById("page").innerHTML;  
            addSpanTagToSentence();
            addSpanTagToParagraf();            
            sentenceEvents();
            //chooseSelectionMode(learn_mode);
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
    //debugger;
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
//document.getElementById("page").onclick = function ()
//{
//    wordsArray.length = 0;
//    sentencesArray.length = 0;
//    arrayOfSeletion = getSelectingWords(getSelectionText());
//    //debugger;
//    if (arrayOfSeletion.length > 0)
//    {
//        $('#select-text').text(getSelectionText());        
//    }

//};
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
$("#btn-call-translate").click(function ()
{
    $("#translate-panel").modal("show");
});
//===========================================================================================================
$('#learn-mode').change(function ()
{
    learn_mode = $('#learn-mode').selectpicker('val');
    local_HTML = undefined;
    $(".clicked").css("background-color", "transparent");
    $(".ru-word").css({ "background-color": "transparent", "font-size": "100%" }).removeAttr("data-toggle");
    cleanLocalSelection();
    speechStop();
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
            $(this).not(".clicked").css("background-color", "transparent");
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
            $(this).not(".clicked").css("background-color", "transparent");
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
            $(this).not(".clicked").css("background-color", "transparent");
        }
    );

    $(".sentence").click(function ()
    {
        if (!isPlay)
        {
            $(".sentence").removeClass("clicked");
            if (learn_mode === learn_by_sentence)
            {
                words_count = 0;
                $(".sentence").css("background-color", "transparent");
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
            if (learn_mode === learn_by_paragraf)
            {
                words_count = 0;
                $(".paragraf").css("background-color", "transparent");
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
            if (learn_mode === learn_by_page)
            {
                words_count = 0;
                $(".book-page").css("background-color", "transparent");
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
    //isPlay = true;
    $("#fa_play").hide();
    $("#fa_pause").show();
    var w = arrayOfSeletion;
    if (arrayOfSeletion.length > 0 && words_count <= arrayOfSeletion.length - 1)
    {
        speech(arrayOfSeletion[words_count]);
    }
    //debugger;
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


