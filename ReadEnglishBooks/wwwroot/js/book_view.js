var pageWordsObj;
var wordsArray = [];
var sentencesArray = [];
var arrayOfSeletion = [];
var sentencesIndex = 0;
var words_count = -1;
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
            //page_HTML = document.getElementById("page").innerHTML;  
            addSpanTagToSentence();
            addSpanTagToParagraf();            
            sentenceEvents();
            current_page = page;
            page_HTML = document.getElementById("page").innerHTML; 
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
    var v = $("#volume").slider("option", "value");
    alert("volume = " + v);
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
            resetWordSelection();
            if (learn_mode === learn_by_sentence)
            {
                words_count = -1;
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
                words_count = -1;
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
                words_count = -1;
                $(".book-page").removeAttr("style");
                $(this).css("background-color", background_of_selected).addClass("clicked");
                arrayOfSeletion = getSelectingWords(this.innerText);
                local_HTML = undefined;
            }
        }
    });
}
//===========================================================================================================
function resetWordSelection()
{
    $(".sentence").removeClass("clicked");
    $(".sentence span").css({
        fontSize: "100%",
        background: ''
    });
    $(".ru-word").popover('hide');
    $("span").removeClass("ru-word");
}
//===========================================================================================================
var isPlay = false;
var is_back = false;

$("#fa_play, #fa_back, #fa-next, #fa_sound").mouseover(function ()
{
    if (!isPlay)
    {
        event.target.style.color = 'pink';
    }
});
//===========================================================================================================
$("#fa_play, #fa_back, #fa-next, #fa_sound").mouseout(function ()
{
    if (!isPlay)
    {
        event.target.style.color = '';
    }
});
//===========================================================================================================
document.getElementById("fa_play").onclick = function (event)
{    
    var w = arrayOfSeletion;
    if (arrayOfSeletion.length > 0)
    {
        isPlay = true;
        is_back = false;
        $("#fa_play").hide();
        $("#fa_pause").show();
        if (words_count < 0 || words_count >= arrayOfSeletion.length)
        {
            words_count = 0;
        }
        speech(arrayOfSeletion[words_count]);
    }
    event.target.style.color = '';
}
//===========================================================================================================
$("#fa_back").click(function (event)
{
    if (arrayOfSeletion.length > 0)
    {
        isPlay = false;
        is_back = true;
        $("#fa_play").show();
        $("#fa_pause").hide();
        words_count--;
        if (words_count < 0 || words_count >= arrayOfSeletion.length)
        {
            words_count = arrayOfSeletion.length - 1;
        }
        speech(arrayOfSeletion[words_count]);        
    }    
});
//===========================================================================================================
$("#fa-next").click(function (event)
{
    if (arrayOfSeletion.length > 0)
    {
        isPlay = false;
        is_back = false;  
        $("#fa_play").show();
        $("#fa_pause").hide();
        words_count++;
        if (words_count < 0 || words_count >= arrayOfSeletion.length)
        {
            words_count = 0;
        }
        speech(arrayOfSeletion[words_count]);        
    }     
});
//===========================================================================================================
$("#fa_sound").click(function ()
{
    if (arrayOfSeletion.length > 0 && words_count >= 0 && words_count < arrayOfSeletion.length)
    {
        speech(arrayOfSeletion[words_count]);
    }
});
//===========================================================================================================
$(document).ready(function ()
{
    getPage(1); 

    $("#volume").slider(
        {
            animate: "fast",
            min: 0.0,
            max: 1.0,
            value: 1.0,
            step: 0.1,
            change: function (event)
            {
                document.getElementById("audio").volume = $("#volume").slider("option", "value");
            }
        });

    
    
    
    return;
});
//===========================================================================================================
window.onload = function ()
{
    var variant = $("#learn-mode").selectpicker('val', learn_mode);
    return;
}
//===========================================================================================================
function CreateAlert(title, message)
{
    //var res = $(divId).append('<div class="alert alert-warning fade in">' +
    //    '<a data-dismiss="alert" href="#" class="close">×</a >' + message + '</div >');
    //$(divId).slideDown();
    var message = "Проверить знания - нажмите Проверить<br/>Повторить еще раз - нажмите Повторить<br/>Читать дальше - нажмите Продолжить";
    $("#dialog_message").html(message);

    $("#dialog-window").dialog({
        title: "Фрагмент изучен",
        show: true,
        hide: true,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: false,
        buttons: {
            "Проверить": function ()
            {
                $(this).dialog("close");
                
            },
            "Повторить": function ()
            {
                $(this).dialog("close");
                
            },
            "Продолжить": function ()
            {
                $(this).dialog("close");
            }
        }
    });
}


