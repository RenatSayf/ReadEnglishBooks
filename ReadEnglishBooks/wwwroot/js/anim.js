var countRepeat = 0;
//=================================================================================================
function backgroundColorAnim(jQbj)
{
    $(jQbj).animate({ backgroundColor: "#00ff21" }, 200, function ()
    {
        $(jQbj).animate({ backgroundColor: "#398cb5" }, 200, function ()
        {
            if (countRepeat < 8)
            {
                backgroundColorAnim(jQbj);
                countRepeat++;
            }
            else
            {
                $(jQbj).removeAttr("style");
                countRepeat = 0;
                return;
            }
        });
    });
}
//================================================================================================
function positionChangeAnim(jQSelector, toPosition, duration)
{
    $(jQSelector).animate({ bottom: toPosition }, duration, function ()
    {

    });
}
//================================================================================================
function iconSoundAnim(jQSelector)
{
    const fontSize = $(jQSelector).css("font-size");
    $(jQSelector).removeClass("fa-volume-up").addClass("fa-volume-down");
    $(jQSelector).animate({ fontSize: fontSize }, 200, function ()
    {
        $(jQSelector).removeClass("fa-volume-down").addClass("fa-volume-up");
        $(jQSelector).animate({ fontSize: fontSize }, 200, function ()
        {
            
        });
    });
}
//================================================================================================
