var locale_HTML;
//============================================================================================================
function speech(en_word)
{
    var ru_word;
    findOnPage(en_word, "page");
    for (var i = 0; i < pageWordsObj.length; i++)
    {
        if (pageWordsObj[i].Eng === en_word)
        {
            ru_word = pageWordsObj[i].Rus;
            break;
        }
    }
    if (ru_word === undefined)
    {
        ru_word = "";
    }
    $("#eng-word").text(en_word);
    $("#rus-word").text(ru_word);
    $('#audio').attr('src', '/Speech/Speech?enword=' + en_word + "&ruword=" + ru_word);
    $('#audio')[0].play();
      
}
//============================================================================================================
$('#audio')[0].onemptied = function ()
{
    //console.log("Event message(onemptied) - Something bad happened and the file is suddenly unavailable (like unexpectedly disconnects)");
    //debugger;
    //$("#div-stop").attr("hidden", "hidden");
    //$("#div-start").removeAttr("hidden");
};
//============================================================================================================
$('#audio')[0].onerror = function ()
{
    console.log("Event message(onerror) - Error occurs when the file is being loaded");
    debugger;
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
};
//============================================================================================================
$('#audio')[0].onended = function (data)
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
            cleanSelectionText();
            alert("Завершено");
        }
        return;
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
            cleanSelectionText();
            alert("Завершено");
        }
        return;
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
            cleanSelectionText();
            alert("Завершено");
        }
        return;
    }

};
//============================================================================================================
function cleanSelectionText()
{
    document.getElementById("page").innerHTML = locale_HTML;
}
//============================================================================================================
function findOnPage(input, tagId) 
{
    cleanSelectionText();
    var search = input.trim();
    var div_tag = document.getElementById(tagId);
    var child_content, naked_text;
    var reg_exp = '\\b\\.*(' + search + '\\b)';
    var target = new RegExp(reg_exp, "gmi");

    for (var i = 0; i < div_tag.children.length; i++)
    {
        var child = div_tag.children[i];
        child_content = child.innerHTML;

        naked_text = child_content.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст

        var replacement = naked_text.match(eval(target));
        //debugger;
        if (replacement !== null) 
        {
            var new_child_content = child_content.replace(target, '<span style="background-color:yellow;">' + replacement[0] + '</span>');
            child.innerHTML = new_child_content;
        }
    }
}