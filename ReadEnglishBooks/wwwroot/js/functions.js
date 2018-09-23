function playIconChange(play)
{
    if (!play)
    {
        $("#i_fa_play").removeClass("fa-pause").addClass("fa-play");

    }
    else
    {
        $("#i_fa_play").removeClass("fa-play").addClass("fa-pause");
    }
}
//===========================================================================================================
function showWordPopover(enWord)
{
    let ruWord;
    SetRuWordClassIntoSentence(enWord);

    for (let i = 0; i < pageWordsObj.length; i++)
    {
        if (pageWordsObj[i].Eng === enWord)
        {
            ruWord = pageWordsObj[i].Rus;
            break;
        }
    }
    if (ruWord === undefined)
    {
        ruWord = "";
    }  

    $("#trans_div").text(ruWord);

    $(".ru-word").popover({
        html: true,
        title: $("#popover-title").html(),
        content: $("#popover-content").html(),
        placement: "bottom"
    });
    $(".ru-word").popover("show");

    $("#btn_sound, #popover-title, .popover-content, .exp").mousedown(function (e)
    {
        e.stopPropagation();
    }).click(function(e) {
        e.stopPropagation();
        });
    return ruWord;
}
//===========================================================================================================
function removeTagsFromText(input) {
    const r = /<(\w+)[^>]*>.*<\/\1>/gi;
    const replaceText = input.replace(r, "");
    return replaceText;
}


