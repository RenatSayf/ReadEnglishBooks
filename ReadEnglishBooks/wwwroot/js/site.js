﻿function getWordsBySentences()
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
    for (var i = 0; i < sentencesArray.length; i++)
    {
        wordsArray.push(getSelectingWords(sentencesArray[i]));
    }
    return wordsArray;
}

//--------------------------------------------------------------------------------------------------------------------

function getSelectingWords(sentence)
{
    var selectText = sentence;
    selectText = selectText.toLowerCase();
    selectText = selectText.replace(/\s/g, '|');
    selectText = selectText.replace(/\./g, '');
    selectText = selectText.replace(/\!/g, '');
    selectText = selectText.replace(/\?/g, '');
    selectText = selectText.replace(/\,/g, '');
    selectText = selectText.replace(/\:/g, '');
    selectText = selectText.replace(/\;/g, '');
    selectText = selectText.replace(/\t/g, '');
    selectText = selectText.replace(/\v/g, '');

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