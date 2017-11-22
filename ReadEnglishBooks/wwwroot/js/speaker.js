var page_HTML;
var local_HTML;
var local_text_id = "local-text-id";
//============================================================================================================
function speech(en_word)
{
    var ru_word;
    findIntoSentence(en_word, local_text_id);    

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

    $(".ru-word").popover({
        //title: 'Заголовок панели',
        content: ru_word,
        trigger: 'hover',
        placement: 'bottom'
    });
    $(".ru-word").popover('show');

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
    $(".ru-word").popover('hide');
};
//============================================================================================================
$('#audio')[0].onended = function (data)
{
    //debugger;
    if (sentencesArray.length > 0)
    {
        $(".ru-word").popover('hide');
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
            cleanSelectionOnPage();
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
            cleanSelectionOnPage();
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
            cleanSelectionOnPage();
            alert("Завершено");
        }
        return;
    }

};
//============================================================================================================
function cleanSelectionOnPage()
{
    document.getElementById("page").innerHTML = page_HTML;
}
//============================================================================================================
function findOnPage(input, tagId) 
{
    cleanSelectionOnPage();
    var search = input.trim();
    var div_tag = document.getElementById(tagId);
    var child_content, naked_text;
    //var reg_exp = '\\b\\.*(' + search + '\\b)';
    var target = new RegExp('\\b\\.*(' + search + '\\b)', "gmi");

    //debugger;
    for (var i = 0; i < div_tag.children.length; i++)
    {
        var child = div_tag.children[i];
        child_content = child.innerHTML;

        naked_text = child_content.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст

        var replacement = naked_text.match(target);
        //debugger;
        if (replacement !== null) 
        {
            local_HTML = replacement[0];
            var new_child_content = child_content.replace(target, '<span id="' + local_text_id + '" style="background-color:#b6ff00;">' + replacement[0] + '</span>');
            child.innerHTML = new_child_content;
            
        }
    }
}
//============================================================================================================
function findSentenceOnPage(input, tagId)
{
    cleanSelectionOnPage();
    var search = input.trim();
    var div_tag = document.getElementsByClassName("book-page");
    var child_content, naked_text;
    //debugger;
    for (var i = 0; i < div_tag[0].children.length; i++)
    {
        child_content = div_tag[0].children[i].innerHTML;        
        naked_text = child_content.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст
        var res = naked_text.search(search);
        if (naked_text.search(search) >= 0)
        {
            var str = naked_text.replace(search, '<span id="' + local_text_id + '" style="background-color:#b6ff00;">' + search + '</span>');
            div_tag[0].children[i].innerHTML = str;
            local_HTML = search;
        }
        
    }
}
//============================================================================================================
function cleanLocalSelection()
{
    if (local_HTML !== undefined)
    {
        document.getElementById(local_text_id).innerHTML = local_HTML;
    }
}
//============================================================================================================
function findIntoSentence(input, tagId) 
{
    cleanLocalSelection();
    input = input.trim();
    var div_tag = document.getElementById(local_text_id);
    var child_content, naked_text;
    var reg_exp = '\\b\\.*(' + input + '\\b)';
    var target = new RegExp(reg_exp, "gmi");

    naked_text = div_tag.innerHTML;

    var replacement = naked_text.match(eval(target));
    //debugger;
    if (replacement !== null) 
    {
        var new_child_content = naked_text.replace(target, '<span class="ru-word" style="background-color:yellow; font-size:150%" data-toggle="popover">' + replacement[0] + '</span>');
        div_tag.innerHTML = new_child_content;
    }
}
//============================================================================================================








