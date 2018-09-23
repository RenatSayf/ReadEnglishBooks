var page_HTML;
var local_HTML;
var local_text_id = "local-text-id";
var words_popover_id;
var current_text_sentence;
var playPromise;
var audio = document.getElementById("audio");
var is_end = true;
var timerId;

//============================================================================================================
function speech(enWord, isPopoverShow, isSpeak)
{
    let ruWord = "";
    if (isPopoverShow)
    {
        ruWord = showWordPopover(enWord);
    }
    if (isSpeak === true)
    {
        const enVoice = $("#en-voices-list").selectpicker("val");
        const ruVoice = $("#ru-voices-list").selectpicker("val");
        const enRate = $("#en-rate").selectpicker("val");
        const ruRate = $("#ru-rate").selectpicker("val");

        $("#popover-spinner").css("visibility", "unset");
        try
        {
            audio.setAttribute("src", `/Speech/Speech?enWord=${enWord}&ruWord=${ruWord}&enVoice=${enVoice}&ruVoice=${ruVoice}&enRate=${enRate}&ruRate=${ruRate}`);
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
// ReSharper disable once UnusedParameter
        playPromise.then(_ =>
        {
            audio.pause();
            is_end = true;
        })
            .catch(error => {
                console.log(error.message);
                return;
            });
    }
}
//============================================================================================================
$("#audio")[0].onplaying = function ()
{
    $("#popover-spinner").css("visibility", "hidden");
    iconSoundAnim("#icon-sound");
    timerId = setInterval(function ()
    {
        iconSoundAnim("#icon-sound");
    }, 500);
    if (isPlay)
    {
        playIconChange(isPlay);
        if (!is_back)
        {
            window.words_count++;
        }
        else
        {
            window.words_count--;
        }
    }
    return;
};
//============================================================================================================
$("#audio")[0].onerror = function ()
{
    console.log("Event message(onerror) - Error occurs when the file is being loaded");
    $("#div-stop").attr("hidden", "hidden");
    $("#div-start").removeAttr("hidden");
    $("#popover-spinner").css("visibility", "hidden");
    clearInterval(timerId);
    $(".ru-word").popover("destroy");
    window.isPlay = false;
};
//============================================================================================================
$("#audio")[0].onended = function ()
{
    is_end = true;
    if (window.isPlay && arrayOfSeletion.length > 0)
    {
        if (words_count <= arrayOfSeletion.length - 1)
        {
            speech(arrayOfSeletion[words_count], true, true);
        }
        else
        {
            backgroundColorAnim("#btn-test-knowledge");
            window.isPlay = false;
            playIconChange(window.isPlay);
            clearInterval(timerId);
        }
        return;
    }
    if (!window.isPlay && words_count >= arrayOfSeletion.length - 1)
    {
        backgroundColorAnim("#btn-test-knowledge");
        playIconChange(window.isPlay);
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
    window.words_count = 0;
    window.isPlay = false;
    playIconChange(window.isPlay);
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
    const search = input.trim();
    const divTag = document.getElementById(tagId);
    let childContent, nakedText;
    const target = new RegExp(`\\b\\.*(${search}\\b)`, "gmi");

    for (let i = 0; i < divTag.children.length; i++)
    {
        const child = divTag.children[i];
        childContent = child.innerHTML;

        nakedText = childContent.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст

        const replacement = nakedText.match(target);
        if (replacement !== null) 
        {
            local_HTML = replacement[0];
            const newChildContent = childContent.replace(target, `<span id="${local_text_id}" style="background-color:#b6ff00;">${replacement[0]}</span>`);
            child.innerHTML = newChildContent;
        }
    }
}
//============================================================================================================
function findSentenceOnPage(input)
{
    cleanSelectionOnPage();
    const search = input.trim();
    const divTag = document.getElementsByClassName("book-page");
    let childContent, nakedText;
    for (let i = 0; i < divTag[0].children.length; i++)
    {
        childContent = divTag[0].children[i].innerHTML;        
        nakedText = childContent.replace(/<[^>]*>/g, "").trim();  //отсекаем все теги и получаем только текст
        const res = nakedText.search(search);
        if (res >= 0)
        {
            const str = nakedText.replace(search, `<span id="${local_text_id}" style="background-color:#b6ff00;">${search}</span>`);
            divTag[0].children[i].innerHTML = str;
            local_HTML = search;
        }        
    }
}
//============================================================================================================
function cleanLocalSelection()
{
    if (local_HTML !== undefined) {
        const clickedElement = document.getElementsByClassName("clicked")[0];
        try
        {
            clickedElement.innerHTML = local_HTML;
            
        } catch (e)
        {
            console.log(`Error into speaker.js -> cleanLocalSelection() - ${e.message}`);
            return;
        }
    }
}
//============================================================================================================
function SetRuWordClassIntoSentence(input) 
{
    cleanLocalSelection();
    input = input.trim();
    const spanTag = document.getElementsByClassName("clicked");
    const regExp = `\\b\\.*(${input}\\b)`;
    const target = new RegExp(regExp, "gmi");

    try
    {
        const nakedText = spanTag[0].innerHTML;
        const replacement = nakedText.match(eval(target));
        if (replacement !== null) 
        {
            const newChildContent = nakedText.replace(target, `<span class="ru-word" style="background-color:yellow; data-toggle="popover">${replacement[0]}</span>`);
            spanTag[0].innerHTML = newChildContent;
            local_HTML = nakedText;
        }
    } catch (e)
    {
        console.log("Error into speaker.js -> SetRuWordClassIntoSentence(input, tagId) - " + e.message);
        speechStop();
        return;
    }
}
//============================================================================================================

//============================================================================================================








