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

    $(".ru-word").popover({
        html: true,
        //title: '<i class="fa fa-volume-up" aria-hidden="true" style="font-size: 100%; text-align: center;"></i>',
        content: '<div>' + ru_word + '</div>',
        //trigger: 'hover',
        placement: 'bottom'
    });
    $(".ru-word").popover('show');

    var en_voice = $("#en-voices-list").selectpicker('val');
    var ru_voice = $("#ru-voices-list").selectpicker('val');
    var en_rate = $("#en-rate").selectpicker('val');
    var ru_rate = $("#ru-rate").selectpicker('val');

    $('#audio').attr('src', '/Speech/Speech?enword=' + en_word + "&ruword=" + ru_word + "&en_voice=" + en_voice + "&ru_voice=" + ru_voice + "&en_rate=" + en_rate + "&ru_rate=" + ru_rate);
    $('#audio')[0].play();
     
}
//============================================================================================================
$('#audio')[0].onplaying = function ()
{
    if (isPlay)
    {
        if (!is_back)
        {
            //debugger;
            words_count++;
        }
        else
        {
            words_count--;
        }
    }
    return;
};
//============================================================================================================
$('#audio')[0].onerror = function ()
{
    console.log("Event message(onerror) - Error occurs when the file is being loaded");
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
    $(".ru-word").popover('hide');
    isPlay = false;
};
//============================================================================================================
$('#audio')[0].onended = function (data)
{
    if (isPlay && arrayOfSeletion.length > 0)
    {
        if (words_count <= arrayOfSeletion.length - 1)
        {
            speech(arrayOfSeletion[words_count]);
        }
        else
        {
            speechStop();
            showDialogComplete("", "");
        }
        return;
    }
    if (!isPlay && words_count >= arrayOfSeletion.length - 1)
    {
        showDialogComplete("", "Проверить знания?");
    }
};
//============================================================================================================
$("#audio")[0].onpause = function ()
{
    cleanLocalSelection();
};
//============================================================================================================
function playStart()
{

}
//============================================================================================================
function speechPause()
{
    $("#fa_play").show();
    $("#fa_pause").hide();
    cleanLocalSelection();
    $(".ru-word").popover('destroy');
    
}
//============================================================================================================
function speechStop()
{
    words_count = 0;
    isPlay = false;
    $("#fa_play").show();
    $("#fa_pause").hide();
    cleanLocalSelection();
    $(".ru-word").popover('destroy');
}
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
    var target = new RegExp('\\b\\.*(' + search + '\\b)', "gmi");

    for (var i = 0; i < div_tag.children.length; i++)
    {
        var child = div_tag.children[i];
        child_content = child.innerHTML;

        naked_text = child_content.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст

        var replacement = naked_text.match(target);
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
        var clicked_element = document.getElementsByClassName("clicked")[0];
        try
        {
            document.getElementsByClassName("clicked")[0].innerHTML = local_HTML;
        } catch (e)
        {
            console.log("Error into speaker.js -> cleanLocalSelection() - " + e.message);
            return;
        }
    }
}
//============================================================================================================
function findIntoSentence(input, tagId) 
{
    cleanLocalSelection();
    input = input.trim();
    var span_tag = document.getElementsByClassName("clicked");
    var child_content, naked_text;
    var reg_exp = '\\b\\.*(' + input + '\\b)';
    var target = new RegExp(reg_exp, "gmi");

    try
    {
        naked_text = span_tag[0].innerHTML;

        var replacement = naked_text.match(eval(target));
        if (replacement !== null) 
        {
            var new_child_content = naked_text.replace(target, '<span class="ru-word" style="background-color:yellow; font-size:150%" data-toggle="popover">' + replacement[0] + '</span>');
            span_tag[0].innerHTML = new_child_content;
            local_HTML = naked_text;
        }
    } catch (e)
    {
        console.log("Error into speaker.js -> findIntoSentence(input, tagId) - " + e.message);
        speechStop();
        return;
    }
}
//============================================================================================================








