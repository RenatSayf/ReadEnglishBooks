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
function positionChangeAnim(jQ_selector, to_position, duration)
{
    $(jQ_selector).animate({ bottom: to_position }, duration, function ()
    {

    });
}
//================================================================================================
function iconSoundAnim(jQ_selector, run)
{
    var font_size = $(jQ_selector).css('font-size');
    if (run)
    {
        $(jQ_selector).removeClass('fa-volume-up').addClass('fa-volume-down');
        $(jQ_selector).animate({ fontSize: font_size }, 200, function ()
        {
            $(jQ_selector).removeClass('fa-volume-down').addClass('fa-volume-up');
            $(jQ_selector).animate({ fontSize: font_size }, 200, function ()
            {
                iconSoundAnim(jQ_selector, true);
            });
        });
    }
    else
    {
        $(jQ_selector).removeClass('fa-volume-down').addClass('fa-volume-up');
        $(jQ_selector).stop();
    }
}
//================================================================================================
