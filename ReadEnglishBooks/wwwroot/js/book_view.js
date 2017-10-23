var wordsArray;
var sentencesArray;
var index;
var first_load = true;

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

$("#btn-learn").click(function ()
{
    words_count = 0;
    wordsArray = getWordsBySentences()[6];
    //wordsArray = getSelectingWords(getSelectionText());
    index = 0;
});


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

document.getElementById("btn-back").onclick = function ()
{
    alert("btn-back is click");
};

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

$("#btn-stop").click(function ()
{
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
    $("#audio")[0].pause();
});

$("#btn-next").on("click", function ()
{
    alert("btn-next is click");
});

$(document).ready(function ()
{
    getPage(1);
});
