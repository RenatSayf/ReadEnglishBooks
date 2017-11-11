
function speech(en_word)
{
    $.ajax({
        type: 'GET',
        url: '/Speech/SendWordsToClient?enword=' + en_word,
        success: function (data)
        {
            var obj = jQuery.parseJSON(data);
            $("#eng-word").text(obj.Eng);
            $("#rus-word").text(obj.Rus);
            //debugger;
            $('#audio').attr('src', '/Speech/Speech?enword=' + obj.Eng + "&ruword=" + obj.Rus);
            $('#audio')[0].play();
        },
        error: function (xhr, status, error)
        {
            alert("Ошибка ajax:\n" + "status - " + status + "   error - " + error);
        },
        dataType: 'JSON'
    });


    
}

$('#audio')[0].onemptied = function ()
{
    //console.log("Event message(onemptied) - Something bad happened and the file is suddenly unavailable (like unexpectedly disconnects)");
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
};

$('#audio')[0].onerror = function ()
{
    console.log("Event message(onerror) - Error occurs when the file is being loaded");
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
};

$('#audio')[0].onended = function (data)
{
    var t = this;
    //debugger;
    if (sentencesArray.length > 0)
    {
        words_count++;
        if (words_count <= sentencesArray[sentencesIndex].length - 1)
        {
            speech(sentencesArray[sentencesIndex][words_count]);
        }
        else
        {
            words_count = 0;
            $("#div-stop").attr("hidden", "hidden");
            $("#div-start").removeAttr("hidden");
            $("#audio")[0].pause();
            alert("Завершено");
        }
    }
    if (wordsArray.length > 0)
    {
        words_count++;
        if (words_count <= wordsArray.length - 1)
        {
            speech(wordsArray[words_count]);
        }
        else
        {
            words_count = 0;
            $("#div-stop").attr("hidden", "hidden");
            $("#div-start").removeAttr("hidden");
            $("#audio")[0].pause();
            alert("Завершено");
        }
    }
    if (arrayOfSeletion.length > 0)
    {
        words_count++;
        if (words_count <= arrayOfSeletion.length - 1)
        {
            speech(arrayOfSeletion[words_count]);
        }
        else
        {
            words_count = 0;
            $("#div-stop").attr("hidden", "hidden");
            $("#div-start").removeAttr("hidden");
            $("#audio")[0].pause();
            alert("Завершено");
        }
    }

 };