'use strict';

class WordPopover {
    constructor(enWord, pageWordsObj)
    {
        this.SetClassIntoSentence(enWord);

        for (let i = 0; i < pageWordsObj.length; i++)
        {
            if (pageWordsObj[i].Eng === enWord)
            {
                this.ruWord = pageWordsObj[i].Rus;
                break;
            }
        }
        if (this.ruWord === undefined)
        {
            this.ruWord = "";
        }
        $("#trans_div").text(this.ruWord);

        $(".ru-word").popover({
            html: true,
            title: $("#popover-title").html(),
            content: $("#popover-content").html(),
            placement: "bottom"
        });

        $("#btn_sound, #popover-title, .popover-content, .exp").mousedown(function (e)
        {
            e.stopPropagation();
        }).click(function (e)
        {
            e.stopPropagation();
        });
        this.show();
    }

    SetClassIntoSentence(input) 
    {
        this.cleanSelection();
        input = input.trim();
        const spanTag = document.getElementsByClassName("clicked");
        const regExp = `\\b\\.*(${input}\\b)`;
        const target = new RegExp(regExp, "gmi");

        try
        {
            const nakedText = spanTag[0].innerHTML;
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

    show() {
        $(".ru-word").popover("show");
    }
}