function getWordsOfPage()
{
    var sentencesArray = [];
    $("h2, h3, p").each(function (i)
    {
        sentencesArray.push($(this).text());
    });

    var wordsArray = [];

    for (var i = 0; i < sentencesArray.length; i++)
    {
        var arr = sentencesArray[i].split(' ');
        for (var j = 0; j < arr.length; j++)
        {
            var word = arr[j].trim('↵');
            word = word.replace('.', '');
            word = word.replace(',', '');
            word = word.replace('!', '');
            word = word.replace('?', '');
            word = word.replace(':', '');
            word = word.toLowerCase();
            var length = word.length;
            var code = word.charCodeAt(0);
            if (length > 0 && ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)))
            {
                wordsArray.push(word);
            }
         }
    }

    var obj = {};
    for (var t = 0; t < wordsArray.length; t++)
    {
        var str = wordsArray[t];
        obj[str] = true;
    }
    //debugger;
    return Object.keys(obj);
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

    debugger;

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

    for (var z = 0; z < sentencesArray.length; z++)
    {
        var tempArray = sentencesArray[z].split(' ');
        var obj2 = {};
        
        for (var k = 0; k < tempArray.length; k++)
        {
            var item = tempArray[k].toLowerCase().replace("↵", "").trim();
            item = item.replace('.', '');
            item = item.replace(',', '');
            item = item.replace('!', '');
            item = item.replace('?', '');
            item = item.replace(':', '');
            item = item.replace(';', '');
            obj2[k] = item;
        }
        wordsArray.push(obj2);        
    }
    //debugger;
    return wordsArray;
}

//--------------------------------------------------------------------------------------------------------------------
function getSelectingWords()
{
    var selectText = window.getSelection().toString();
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
