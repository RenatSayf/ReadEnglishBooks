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
        //this.show();
    }
    //---------------------------------------------------------------------------------------------
    get getRuWord()
    {
        return this.ruWord;
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
                this.popover.popover("destroy");
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
        this.btnSound_OnClick();
        this.audioEvents();
        this.btnTestKnowledge_OnClick();
    }
    //---------------------------------------------------------------------------------------------
    destroy()
    {
        this.cleanSelection();
    }
    //---------------------------------------------------------------------------------------------
    btnSound_OnClick()
    {
        $("#btn_sound-1").click(function()
        {
            const enVoice = $("#en-voices-list").selectpicker("val");
            const ruVoice = $("#ru-voices-list").selectpicker("val");
            const enRate = $("#en-rate").selectpicker("val");
            const ruRate = $("#ru-rate").selectpicker("val");
            const enWord = $('.clicked span[aria-describedby *= "popover"]').text();
            const ruWord = $("#trans_div-1").text();
            $("#popover-spinner-1").css("visibility", "unset");
            try
            {
                const audio = document.getElementById("audio");
                audio.setAttribute("src", `/Speech/Speech?enWord=${enWord}&ruWord=${ruWord}&enVoice=${enVoice}&ruVoice=${ruVoice}&enRate=${enRate}&ruRate=${ruRate}`);
                const playPromise = audio.play();
            } catch (e)
            {
                return;
            }
        });
    }
    //---------------------------------------------------------------------------------------------
    audioEvents()
    {
        const audioElement = document.getElementById("audio");
        audioElement.onplaying = function ()
        {
             $("#popover-spinner-1").css("visibility", "hidden");
        };

        audioElement.onended = function()
            {};
    }
    //---------------------------------------------------------------------------------------------
    btnTestKnowledge_OnClick()
    {
        document.getElementById("btn-test-knowledge-1").onclick = function()
        {
            const clickedElement = document.getElementsByClassName("clicked")[0];
            const arrayOfSeletion = getSelectingWords(clickedElement.innerText);
            showKnowledgeTest(arrayOfSeletion);
        };
    }
    //---------------------------------------------------------------------------------------------
    btnYaTranslate_OnClick()
    {
        document.getElementById("btn-ya-translate-1").onclick = function()
        {

        };
    }
    //---------------------------------------------------------------------------------------------
    





}