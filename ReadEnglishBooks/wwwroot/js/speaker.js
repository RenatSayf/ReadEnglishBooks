var page_HTML;
var local_HTML;
var local_text_id = "local-text-id";
var words_popover_id;
var current_text_sentence;
var playPromise;
var audio = document.getElementById('audio');
var is_end = true;
var timerId;

//============================================================================================================
function speech(en_word, is_popover_show)
{
    var ru_word;
    if (is_popover_show)
    {
        ru_word = showWordPopover(en_word);
    }
    //var ru_word;
    //findIntoSentence(en_word, local_text_id);    

    //for (var i = 0; i < pageWordsObj.length; i++)
    //{
    //    if (pageWordsObj[i].Eng === en_word)
    //    {
    //        ru_word = pageWordsObj[i].Rus;
    //        break;
    //    }
    //}
    //if (ru_word === undefined)
    //{
    //    ru_word = "";
    //}  

    //showWordPopover(ru_word);

    //$("#trans_div").text(ru_word);

    //if (is_popover_show)
    //{
    //    $(".ru-word").popover({
    //        html: true,
    //        title: $("#popover-title").html(),
    //        content: $("#popover-content").html(),
    //        placement: 'bottom'
    //    });
    //    $(".ru-word").popover('show');

    //    $("#btn_sound, #popover-title, .popover-content, .exp").click(function (e)
    //    {
    //        e.stopPropagation();
    //    });
    //}
    
    if (is_end === true)
    {
        var en_voice = $("#en-voices-list").selectpicker('val');
        var ru_voice = $("#ru-voices-list").selectpicker('val');
        var en_rate = $("#en-rate").selectpicker('val');
        var ru_rate = $("#ru-rate").selectpicker('val');

        $("#popover-spinner").css("visibility", "unset");
        try
        {
            audio.setAttribute('src', '/Speech/Speech?enword=' + en_word + "&ruword=" + ru_word + "&en_voice=" + en_voice + "&ru_voice=" + ru_voice + "&en_rate=" + en_rate + "&ru_rate=" + ru_rate);
            playPromise = audio.play();
            is_end = false;
        } catch (e)
        {
            return;
        }
    }     
}
//============================================================================================================
function audioPause()
{
    if (playPromise !== undefined)
    {
        playPromise.then(_ =>
        {
            audio.pause();
            is_end = true;
        })
            .catch(error =>
            {
                return;
            });
    }
}
//============================================================================================================
$('#audio')[0].onplaying = function ()
{
    $("#popover-spinner").css("visibility", "hidden");
    iconSoundAnim('#icon-sound');
    timerId = setInterval(function ()
    {
        iconSoundAnim('#icon-sound');
    }, 500);
    if (isPlay)
    {
        playIconChange(isPlay);
        if (!is_back)
        {
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
    $("#popover-spinner").css("visibility", "hidden");
    clearInterval(timerId);
    $(".ru-word").popover('destroy');
    isPlay = false;
};
//============================================================================================================
$('#audio')[0].onended = function (data)
{
    is_end = true;
    if (isPlay && arrayOfSeletion.length > 0)
    {
        if (words_count <= arrayOfSeletion.length - 1)
        {
            speech(arrayOfSeletion[words_count], true);
        }
        else
        {
            backgroundColorAnim("#btn-test-knowledge");
            isPlay = false;
            playIconChange(isPlay);
            clearInterval(timerId);
        }
        return;
    }
    if (!isPlay && words_count >= arrayOfSeletion.length - 1)
    {
        backgroundColorAnim("#btn-test-knowledge");
        playIconChange(isPlay);
        clearInterval(timerId);
    }
};
//============================================================================================================
$("#audio")[0].onpause = function ()
{
    $("#popover-spinner").css("visibility", "hidden");
    playIconChange(isPlay);
    clearInterval(timerId);
};
//============================================================================================================
function speechStop()
{
    words_count = 0;
    isPlay = false;
    playIconChange(isPlay);
    clearInterval(timerId);
    cleanLocalSelection();
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








