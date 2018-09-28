'use strict';

class WordPopover
{
    constructor(enWord, pageWordsObj)
    {
        this.SetClassIntoSentence(enWord);

        for (let i = 0; i < pageWordsObj.length; i++)
        {
            if (pageWordsObj[i].Eng === enWord)
            {
                this.ruWord = pageWordsObj[i].Rus;
                this.isRepeat = pageWordsObj[i].IsRepeat;
                break;
            }
        }
        if (this.ruWord === undefined)
        {
            this.ruWord = "";
        }
        $("#trans_div").text(this.ruWord);
        
        if (this.isRepeat)
        {
            $("#btn-is-study > i").removeClass("fa-check-square-o").addClass("fa-square-o");
        }

        $(".ru-word").popover({
            html: true,
            title: $("#popover-title").html(),
            content: $("#popover-content").html(),
            placement: "bottom"
        });

        $("#btn_sound, #popover-title, .popover-content, .exp").mousedown(function (e)
        {
            e.stopPropagation();
        }, false).click(function (e)
        {
            e.stopPropagation();
        }, false);
        this.show();
    }
    //---------------------------------------------------------------------------------------------
    SetClassIntoSentence(input) 
    {
        this.cleanSelection();
        input = input.trim();
        const spanTag = document.getElementsByClassName("clicked");
        const regExp = `\\b\\.*(${input}\\b)`;
        const target = new RegExp(regExp, "gmi");

        try
        {
            const nakedText = spanTag[0].innerText;
            const replacement = nakedText.match(eval(target));
            if (replacement !== null) 
            {
                const newChildContent = nakedText.replace(target, `<span class="ru-word" style="background-color:yellow; font-weight: bold;" data-toggle="popover">${replacement[0]}</span>`);
                spanTag[0].innerHTML = newChildContent;
                this.local_HTML = nakedText;
            }
        } catch (e)
        {
            console.log(`Error into speaker.js -> SetRuWordClassIntoSentence(input) - ${e.message}`);
            speechStop();
            return;
        }
    }
    //---------------------------------------------------------------------------------------------
    cleanSelection()
    {
        if (this.local_HTML !== undefined)
        {
            const clickedElement = document.getElementsByClassName("clicked")[0];
            try
            {
                clickedElement.innerHTML = this.local_HTML;

            } catch (e)
            {
                console.log(`Error into speaker.js -> cleanLocalSelection() - ${e.message}`);
                return;
            }
        }
    }
    //---------------------------------------------------------------------------------------------
    show()
    {
        $(".ru-word").popover("show");
        $(".ru-word").on("shown.bs.popover",
            function ()
            {
                document.getElementById("btn_sound").addEventListener("mousedown",
                    function (event)
                    {
                        event.stopPropagation();
                    }, false);

                $("#popover-spinner").mousedown(function (event)
                {
                    event.stopPropagation();
                }, false);
                document.getElementById("trans_div").addEventListener("mousedown",
                    function (event)
                    {
                        event.stopPropagation();
                    }, false);

                $("#btn_sound").click(function ()
                {

                });

                $("#btn-is-study").mousedown(function (event)
                {
                    event.stopPropagation();
                }).click(function ()
                {
                    if ($("#btn-is-study > i").hasClass("fa-square-o"))
                    {
                        $("#btn-is-study > i").removeClass("fa-square-o").addClass("fa-check-square-o");
                        return;
                    }
                    if ($("#btn-is-study > i").hasClass("fa-check-square-o"))
                    {
                        $("#btn-is-study > i").removeClass("fa-check-square-o").addClass("fa-square-o");
                        return;
                    }
                    });

                
            });
    }
    //---------------------------------------------------------------------------------------------
    destroy()
    {
        this.cleanSelection();
    }
}