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
            if (word != "")
            {
                wordsArray.push(word); 
            }
         }
    }
    //debugger;
    return wordsArray;
}
