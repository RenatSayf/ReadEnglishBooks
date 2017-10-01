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
    for (var i = 0; i < wordsArray.length; i++)
    {
        var str = wordsArray[i];
        obj[str] = true;
    }
    //debugger;
    return Object.keys(obj);
}
