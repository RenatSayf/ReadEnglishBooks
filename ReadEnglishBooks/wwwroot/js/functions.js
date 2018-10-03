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
function removeTagsFromText(input)
{
    const r = /<(\w+)[^>]*>.*<\/\1>/gi;
    const replaceText = input.replace(r, "");
    return replaceText;
}
//===========================================================================================================
function clearAllIntervals()
{
    for (var i = 1; i <= 10000; i++)
    {
        clearInterval(i);
    }
    $("#icon-sound").removeClass("fa-volume-down").addClass("fa-volume-up");
}

