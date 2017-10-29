var wordsArray;
var sentencesArray;
var index;
var first_load = true;
//===========================================================================================================
document.getElementById("btn-learn-all").onclick = function ()
{
    var sentences = "";
    words_count = 0;
    $("h2, h3, p").each(function (i)
    {
        sentences += $(this).text() + " ";
    });
    wordsArray = getSelectingWords(sentences);
    index = 0;
};
//===========================================================================================================
$("#btn-learn").click(function ()
{
    words_count = 0;
    wordsArray = getWordsBySentences()[6];    
    index = 0;
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
            alert("Ошибка ajax\n" + xhr.responseText + '|\n' + status + '|\n' + error);
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
    if (wordsArray !== null && words_count <= wordsArray.length - 1)
    {
        speech(wordsArray[words_count]);
    }

    //if (sentencesArray !== null && words_count <= sentencesArray[0].length)
    //{
    //    speech(sentencesArray[words_count]);
    //}

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
    wordsArray = getSelectingWords(getSelectionText());
    if (wordsArray !== null && wordsArray.length > 0)
    {
        $('#select-text').text(getSelectionText());
        $("#translate-panel").modal("show");
    }
    
}
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
            alert("Ошибка ajax\n" + xhr.responseText + '|\n' + status + '|\n' + error);
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
            '<td><a class="word-td">' + (i + 1) + '</a></td>' +
            '<td><a class="word-td">' + decodeURIComponent(data[i].english) + '</a></td>' +
            '<td><a class="word-td">' + '<input type="text" value="' + decodeURIComponent(data[i].translate) + '" />' + '</a></td>' +
            '</tr>');
    }
    //wordsListOnClick();
}
//===========================================================================================================
var select_tr;
function wordsListOnClick()
{
    $('.word-td').click(function (e)
    {
        select_tr = $(this).parent('td').parent('tr');
        var en_word = select_tr[0].children[1].innerText;
        var ru_word = select_tr[0].children[2].innerText;
        $('#english').val(en_word);
        $('#trans').val(ru_word);
        //debugger;
    });
}





$(document).ready(function ()
{
    getPage(1);

    
});
