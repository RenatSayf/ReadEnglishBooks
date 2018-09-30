'use strict';

class WordPopover
{
    
    constructor(enWord, pageWordsObj)
    {
        this.SetClassIntoSentence(enWord);
        this.enWord = enWord;

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
        $("#trans_div-1").text(this.ruWord);
        
        if (this.isRepeat)
        {
            $("#btn-is-study-1 > i").removeClass("fa-check-square-o").addClass("fa-square-o");
        }

        this.popover = $(".ru-word").popover({
            html: true,
            title: $("#popover-title-1").html(),
            content: $("#popover-content-1").html(),
            placement: "bottom"
        });

        $("#btn_sound-1, #popover-title-1, .popover-content, .exp").mousedown(function (e)
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
        //$(".ru-word").popover("show");
        this.popover.popover("show");
        this.popover.on("shown.bs.popover",
            function ()
            {
                document.getElementById("btn_sound-1").addEventListener("mousedown",
                    function (event)
                    {
                        event.stopPropagation();
                    }, false);

                $("#popover-spinner-1").mousedown(function (event)
                {
                    event.stopPropagation();
                }, false);
                document.getElementById("trans_div-1").addEventListener("mousedown",
                    function (event)
                    {
                        event.stopPropagation();
                    }, false);

                document.getElementById("btn_sound-1").addEventListener("click",
                    function (event)
                    {
                        event.stopPropagation();
                        WordPopover.btnSound_OnClick();
                    }, false);

                $("#btn-is-study-1").mousedown(function (event)
                {
                    event.stopPropagation();
                }).click(function ()
                {
                    if ($("#btn-is-study-1 > i").hasClass("fa-square-o"))
                    {
                        $("#btn-is-study-1 > i").removeClass("fa-square-o").addClass("fa-check-square-o");
                        return;
                    }
                    if ($("#btn-is-study-1 > i").hasClass("fa-check-square-o"))
                    {
                        $("#btn-is-study-1 > i").removeClass("fa-check-square-o").addClass("fa-square-o");
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
    //---------------------------------------------------------------------------------------------
    static btnSound_OnClick()
    {
        this.enVoice = $("#en-voices-list").selectpicker("val");
        this.ruVoice = $("#ru-voices-list").selectpicker("val");
        this.enRate = $("#en-rate").selectpicker("val");
        this.ruRate = $("#ru-rate").selectpicker("val");
        this.audio = document.getElementById("audio");
        this.enWord = $(".ru-word").text();
        this.ruWord = $("#trans_div-1").text();
        $("#popover-spinner-1").css("visibility", "unset");
        try
        {
            this.audio.setAttribute("src", `/Speech/Speech?enWord=${this.enWord}&ruWord=${this.ruWord}&enVoice=${this.enVoice}&ruVoice=${this.ruVoice}&enRate=${this.enRate}&ruRate=${this.ruRate}`);
            this.playPromise = audio.play();
        } catch (e)
        {
            return;
        }
    }





}