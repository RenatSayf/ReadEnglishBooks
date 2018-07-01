function getSelectionText()
{
    var txt = '';
    if (txt = window.getSelection)
    { // Не IE, используем метод getSelection
        txt = window.getSelection().toString();
    } else
    { // IE, используем объект selection
        txt = document.selection.createRange().text;
    }
    return txt;
}

//--------------------------------------------------------------------------------------------------------------------

function getWordsBySentences()
{
    var paragrafArray = [];
    var sentencesGroupArray = [];
    var sentencesArray = [];
    $("h2, h3, p").each(function (i)
    {
        paragrafArray.push($(this).text().replace(/\t/g, '').replace(/\v/g, '').trim());
    });

    for (var i = 0; i < paragrafArray.length; i++)
    {
        sentencesGroupArray.push(paragrafArray[i].split('.'));
    }

    for (var t = 0; t < sentencesGroupArray.length; t++)
    {
        for (var j = 0; j < sentencesGroupArray[t].length; j++)
        {
            var sentences = sentencesGroupArray[t][j].replace("↵", "").trim();
            if (sentences !== "")
            {
                sentencesArray.push(sentences);
            }
        }
    }

    var wordsArray = [];
    for (var y = 0; y < sentencesArray.length; y++)
    {
        wordsArray.push(getSelectingWords(sentencesArray[y]));
    }
    return wordsArray;
}

//--------------------------------------------------------------------------------------------------------------------

function getSelectingWords(sentence)
{
    var selectText = sentence;
    selectText = selectText.toLowerCase();
    selectText = selectText.replace(/^'/g, '');
    selectText = selectText.replace(/\s'/g, ' ');
    selectText = selectText.replace(/'\s/g, ' ');    
    selectText = selectText.replace(/\./g, '');
    selectText = selectText.replace(/\!/g, '');
    selectText = selectText.replace(/\?/g, '');
    selectText = selectText.replace(/\,/g, '');
    selectText = selectText.replace(/\:/g, '');
    selectText = selectText.replace(/\;/g, '');
    selectText = selectText.replace(/\t/g, '');
    selectText = selectText.replace(/\v/g, '');
    selectText = selectText.replace(/\s/g, '|');

    var wordsArray = selectText.split('|');
    var obj = {};
    for (var j = 0; j < wordsArray.length; j++)
    {
        var str = wordsArray[j];
        if (str !== "")
        {
            var length = str.length;
            var code = str.charCodeAt(0);
            if (length > 0 && ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)))
            {
                obj[str] = true;
            }
        }
    }
    //debugger;
    return Object.keys(obj);
}

//--------------------------------------------------------------------------------------------------------------------
function addSpanTagToSentence()
{
    $('p, h2, h3, h4, h5').each(function ()
    {
        var content = this.innerHTML;
        var arr_spliters = content.match(/[.!?:]/gmi);
        var arr_content = [];
        arr_content = content.split(/[.!?:]/gmi);
        var new_content = "";

        for (var i = 0; i < arr_content.length; i++)
        {
            var res = arr_content[i].search(/[a-zA-Z\d]/gmi);
            if (arr_content[i].length === 0 || arr_content[i].search(/[a-zA-Z\d]/gmi) < 0)
            {
                arr_content.splice(i, 1);
            }
        }

        try
        {
            for (var j = 0; j < arr_content.length; j++)
            {
                if (arr_content[j] !== "" && arr_content[j] !== " ")
                {
                    arr_content[j] = '<span class="sentence">' + arr_content[j] + arr_spliters[j] + '</span>';
                }
            }
            new_content = arr_content.join(" ");
            this.innerHTML = new_content;
        } catch (e)
        {
            this.innerHTML = content;
        }
    });
}
//--------------------------------------------------------------------------------------------------------------------
function addSpanTagToParagraf()
{
    $('p, h2, h3').each(function ()
    {
        var content = this.innerHTML;
        this.innerHTML = '<span class="paragraf">' + content + '</span>';
    });
    var element = document.getElementById("#learn-mode");
}
//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------









