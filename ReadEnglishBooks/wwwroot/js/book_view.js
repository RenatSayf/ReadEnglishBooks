var pageWordsObj;
var wordsArray = [];
var sentencesArray = [];
var arrayOfSeletion = [];
var studyWordsObj = [];
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
var selectedWord;
//===========================================================================================================
function getPage(page)
{
    $.ajax({
        type: 'GET',
        url: '/Book/GetPage?page=' + page,
        success: function (data)
        {
            //debugger;
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
            $('#pagination-demo').twbsPagination('destroy');
            first_load = true;
            $('#pagination-demo').twbsPagination({
                totalPages: page_count - 1,
                startPage: page,
                next: '>',
                prev: '<',
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
            addSpanTagToSentence();
            addSpanTagToParagraf();            
            sentenceEvents();
            current_page = page;
            page_HTML = document.getElementById("page").innerHTML;
            wordsArray = [];
            sentencesArray = [];
            arrayOfSeletion = [];
            words_count = 0;
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
        speech(wordsArray[words_count], true);
    }

    if (sentencesArray.length > 0 && words_count <= sentencesArray[sentencesIndex].length)
    {
        speech(sentencesArray[sentencesIndex][words_count], true);
    }
    if (arrayOfSeletion.length > 0 && words_count <= arrayOfSeletion.length - 1)
    {
        speech(arrayOfSeletion[words_count], true);
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
//$("#btn-next").on("click", function ()
//{
//    var v = $("#volume").slider("option", "value");
//    alert("volume = " + v);
//});

//===========================================================================================================
$('.btn-translate-by-words').click(function (e)
{
    e.preventDefault();
    $("#trans-select-panel").modal("hide");
    var text = getSelectionText();
    if (text === '')
    {
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/Book/GetTextFromClient?text=' + text + '&issentence=' + false,
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
    var data = $('table .word-tr').map(function ()
    {
        return{
            eng: $(this.cells[1]).text(),
            rus: this.cells[2].children[0].value,
            isrepeat: true
        };
    }).get();
    //debugger;
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
    $("#trans-select-panel").modal("show");
});
//===========================================================================================================
$('#learn-mode').change(function ()
{
    learn_mode = $('#learn-mode').selectpicker('val');
    local_HTML = undefined;
    arrayOfSeletion.length = 0;
    //$('#audio')[0].pause();
    audioPause();
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
    ).mousedown(function () {
        $('span, p').removeClass('for-select').removeClass('translate');
        $(this).addClass('for-select');
    });

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

    $(".sentence").click(function (e)
    {
        positionChangeAnim("#book-play-panel", 0, 200);

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
                //debugger;
                $("#target-text").text(this.innerText);
                $("#translated-text").text("");
            }
        }
        return;
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
                $("#target-text").text(this.innerText);
                $("#translated-text").text("");
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
                $("#target-text").text("");
                $("#translated-text").text("");
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
    $("span, .ru-word, .clicked, .sentence").popover('destroy');
    $("span").removeClass("ru-word");
    
}
//===========================================================================================================
var isPlay = false;
var is_back = false;
//===========================================================================================================
document.getElementById("fa_play").onclick = function (event)
{
    var str = event.currentTarget.firstElementChild.className;
    var regPlay = new RegExp('fa-play', 'gi');
    var regPause = new RegExp('fa-pause', 'gi');

    if (str.match(regPlay))
    {
        var w = arrayOfSeletion;
        if (arrayOfSeletion.length > 0)
        {
            isPlay = true;
            is_back = false;
            playIconChange(isPlay);
            if (words_count < 0 || words_count >= arrayOfSeletion.length)
            {
                words_count = 0;
            }
            speech(arrayOfSeletion[words_count], true);
        }
        event.target.style.color = '';
    }
    if (str.match(regPause))
    {
        isPlay = false;
        audioPause();
        playIconChange(isPlay);
    }
};
//===========================================================================================================
$("#fa_back").click(function (event)
{    
    if (arrayOfSeletion.length > 0)
    {
        $(".popover").remove();
        $(".ru-word").popover('destroy');
        isPlay = false;
        is_back = true;
        $("#fa_play").show();
        $("#fa_pause").hide();
        words_count--;
        if (words_count < 0 || words_count >= arrayOfSeletion.length)
        {
            words_count = arrayOfSeletion.length - 1;
        }
        speech(arrayOfSeletion[words_count], true);        
    }    
});
//===========================================================================================================
function nextClick()
{    
    if (arrayOfSeletion.length > 0)
    {
        $(".ru-word").popover('destroy');
        isPlay = false;
        is_back = false;
        $("#fa_play").show();
        $("#fa_pause").hide();
        words_count++;
        if (words_count < 0 || words_count >= arrayOfSeletion.length)
        {
            words_count = 0;
        }
        speech(arrayOfSeletion[words_count], true);
    }  
}
//===========================================================================================================
$("#fa-next").click(function (event)
{
    nextClick(); 
});
//===========================================================================================================
function speakOnly()
{
    
    if (arrayOfSeletion.length > 0 && words_count >= 0 && words_count < arrayOfSeletion.length)
    {
        speech(arrayOfSeletion[words_count], true);
    }
}
//===========================================================================================================
$(document).ready(function ()
{
    var book_number = $("#book-number").text();
    getPage(parseInt(book_number)); 

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

    $('#book-play-panel').popover
        ({
            placement: "top"

        });
    $("#book-play-panel").popover("show").on('shown.bs.popover', function ()
    {
        setTimeout(function ()
        {
            $("#book-play-panel").popover("destroy");
        }, 10000);
    });

    getUserSettings();

    return;
});
//===========================================================================================================
window.onload = function ()
{
    var variant = $("#learn-mode").selectpicker('val', learn_mode);
    return;
};
//===========================================================================================================
function showKnowledgeTest()
{
    isPlay = false;
    $('*').popover('destroy');
    window.studyWordsArray = getStudyWords(arrayOfSeletion, learn_mode);
    if (window.studyWordsArray.length > 0)
    {
        fillTestTable(window.studyWordsArray, words_index);
    }
    $("#word-test-box").modal("show");
    $(".modal-title").text("Найди подходящий перевод");
}
//===========================================================================================================
function showDialogComplete(title, message)
{
    message = "Проверить знания - нажмите <b>Проверить</b><br/><br/>Повторить еще раз - нажмите <b>Повторить</b><br/><br/>Читать дальше - нажмите <b>Продолжить</b>";
    $("#dialog_message").html(message);

    $("#dialog-window").dialog({
        dialogClass: "fragm-is-studied-dialog",
        title: "Фрагмент изучен",
        show: true,
        hide: true,
        resizable: false,
        height: "auto",
        width: "auto",
        modal: false,
        open: function (event, ui)
        {
            $(this).parent().focus();
        },
        buttons: {
            "Проверить": function ()
            {
                $(this).dialog("close");
                studyWordsArray = getStudyWords(arrayOfSeletion, learn_mode);

                if (studyWordsArray.length > 0)
                {
                    fillTestTable(studyWordsArray, words_index);
                }
                var center = $("body").height();
                //$("#word-test-box").scrollTop(center /2);
                $("#word-test-box").modal("show");
                $(".modal-title").text("Найди подходящий перевод");
            },
            "Повторить": function ()
            {
                $(this).dialog("close");
                $("#fa_play").click();
                return false;
            },
            "Продолжить": function ()
            {
                $(this).dialog("close");
            }
        }
    });
}
//===========================================================================================================
$("#page").on('taphold', function ()
{
    var text = getSelectionText();
    //debugger;
    if (text !== "") 
    {
        selectedWord = text;
    }
});
//===========================================================================================================
jQuery('span').bind('classChanged', function() {
     console.log('class changed');
});
//===========================================================================================================
//var origFn = $.fn.addClass;
//$.fn.addClass = function(className) {
//    //  Выполняем здесь необходимый нам код
//    //  и вызываем оригинальную функцию
//    console.log('class changed - ' + className);
//    origFn.apply(this, arguments);
//};
//===========================================================================================================
$("#page").mouseup(function (e)
{
    var text = getSelectionText();
    //debugger;
    if (text !== "") {
        selectedWord = text;
        
    }
});
//===========================================================================================================
$(".btn-trans-by-text").click(function (e)
{
    e.preventDefault();
    var text = $("#target-text").text();
    if (text === '')
    {
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/Book/GetTextFromClient?text=' + text + '&issentence=' + true,
        success: function (data)
        {
            $("#translated-text").text(data[0].translate);
            return;
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "\nerror - " + error);
        },
        dataType: 'JSON'
    });
});
//===========================================================================================================
function btnSettings_OnLick()
{
    $("#settings-panel").modal("show");
}
//===========================================================================================================
function getUserSettings()
{
    $.ajax({
        type: 'POST',
        url: '/Book/GetSettings',
        success: function (data)
        {
            if (data !== null)
            {
                $("#en-voices-list").empty();
                var settings_obj = JSON.parse(data);
                //debugger;
                for (var i = 0; i < settings_obj.en_voices.length; i++)
                {
                    var en_voice = settings_obj.en_voices[i];
                    $("#en-voices-list").append("<option value='" + en_voice + "'>" + en_voice + "</option>");
                    $("#en-voices-list").selectpicker('refresh');
                }

                $("#ru-voices-list").empty();
                for (var j = 0; j < settings_obj.ru_voices.length; j++)
                {
                    var ru_voice = settings_obj.ru_voices[j];
                    $("#ru-voices-list").append("<option value='" + ru_voice + "'>" + ru_voice + "</option>");
                    $("#ru-voices-list").selectpicker('refresh');
                }
                try
                {
                    if (settings_obj.userVoices.length >= 2)
                    {
                        $("#en-voices-list").selectpicker('val', settings_obj.userVoices[0]);
                        $("#ru-voices-list").selectpicker('val', settings_obj.userVoices[1]);
                    }
                    if (settings_obj.userVoicesRate.length === 2)
                    {
                        $("#en-rate").selectpicker('val', settings_obj.userVoicesRate[0]);
                        $("#ru-rate").selectpicker('val', settings_obj.userVoicesRate[1]);
                    }
                } catch (e)
                {
                    e.message;
                }
            }
            return;
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "\nerror - " + error);
        },
        dataType: 'JSON'
    });
}
//===========================================================================================================
function btnSaveSetings_OnClick()
{
    var en_voice = $("#en-voices-list").selectpicker('val');
    var ru_voice = $("#ru-voices-list").selectpicker('val');
    var en_rate = $("#en-rate").selectpicker('val');
    var ru_rate = $("#ru-rate").selectpicker('val');

    $.ajax({
        type: 'POST',
        url: '/Book/SetSettings?en_voice=' + en_voice + '&ru_voice=' + ru_voice + '&en_rate=' + en_rate + '&ru_rate=' + ru_rate,
        success: function (data)
        {
            //debugger;
            $("#settings-panel").modal("hide");
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "\nerror - " + error);
        },
        dataType: 'JSON'
    });    
}
//===========================================================================================================
function enRate_OnChange()
{
    var sel = $("#en-rate").selectpicker('val');
    
}
//===========================================================================================================
function ruRate_OnChange()
{
    var sel = $("#ru-rate").selectpicker('val');
    
}










