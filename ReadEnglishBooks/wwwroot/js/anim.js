var countRepeat = 0;
//=================================================================================================
function fontSizeAnim(jQbj)
{
    $(jQbj).animate({ fontSize: "200%" }, 200, function ()
    {
        $(jQbj).animate({ fontSize: "140%" }, 200, function ()
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