﻿var countRepeat = 0;
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
