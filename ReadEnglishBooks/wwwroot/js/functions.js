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