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
function showWordPopover(en_word)
{
    var ru_word;
    SetRuWordClassIntoSentence(en_word, local_text_id);

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

    $("#trans_div").text(ru_word);

    $(".ru-word").popover({
        html: true,
        title: $("#popover-title").html(),
        content: $("#popover-content").html(),
        placement: 'bottom'
    });
    $(".ru-word").popover('show');

    $("#btn_sound, #popover-title, .popover-content, .exp").mousedown(function (e)
    {
        e.stopPropagation();
    });
    return ru_word;
}
//===========================================================================================================
function setSrcToAudioElement(do_play)
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
//===========================================================================================================
function removeTagsFromText(input) {
    var r = /<(\w+)[^>]*>.*<\/\1>/gi;
    var replace = input.replace(r, "");
    debugger;
    return replace;
}


