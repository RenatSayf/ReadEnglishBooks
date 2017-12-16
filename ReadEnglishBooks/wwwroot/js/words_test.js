function getStudyWords(words_array)
{
    studyWordsObj = [];
    for (var i = 0; i < words_array.length; i++)
    {
        for (var j = 0; j < pageWordsObj.length; j++)
        {
            if (pageWordsObj[j].Eng === words_array[i])
            {
                var obj = {
                    Eng: pageWordsObj[j].Eng,
                    Rus: pageWordsObj[j].Rus,
                    IsRepeat: pageWordsObj[j].IsRepeat
                }
                studyWordsObj.push(obj);
            }
        }
    }
    return studyWordsObj;
}
//===========================================================================================================

function fillTestTable(words_array, learn_mode)
{
    var words_obj;
    if (learn_mode === "sentence" || learn_mode === "paragraf")
    {
        words_obj = getStudyWords(words_array);
    }
    if (learn_mode === "page")
    {
        words_obj = pageWordsObj;
    }

    $("#word-test-box tr").remove();
    for (var i = 0; i < words_obj.length; i++)
    {
        $("#word-test-box tbody").append(
            '<tr>' +
            '<td><button type="button" class="btn btn-primary text-center">' + words_obj[i].Eng + '</button ></td > ' +
            '<td><button type="button" class="btn btn-primary text-center">' + words_obj[i].Rus + '</button></td>' +
            '</tr > '
        );
    }
}