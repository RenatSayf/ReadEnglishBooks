
function speech(en_word)
{
    $('#audio').attr('src', '/Speech/Speech?enword=' + en_word);
    $('#audio')[0].play();
}

$('#audio')[0].onemptied = function ()
{
    //console.log("Event message(onemptied) - Something bad happened and the file is suddenly unavailable (like unexpectedly disconnects)");
};

$('#audio')[0].onerror = function ()
{
    console.log("Event message(onerror) - Error occurs when the file is being loaded");
};

$('#audio')[0].onended = function ()
{
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
 };