var countRepeat = 0;
//=================================================================================================
function fontSizeAnim(jQbj)
{
    $(jQbj).animate({ fontSize: "200%", color: "#FFFF00" }, 200, function ()
    {
        $(jQbj).animate({ fontSize: "140%", color: "#FFFFFF" }, 200, function ()
        {
            if (countRepeat < 4)
            {
                fontSizeAnim(jQbj, true);
                countRepeat++;
            }
            else
            {
                countRepeat = 0;
                return;
            }
        });
    });
}
//================================================================================================
function positionChange(jQbj, to_position, duration)
{
    $(jQbj).animate({ bottom: to_position }, duration, function ()
    {

    });
}