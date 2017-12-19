var words_index = 0;
var studyWordsArray = [];
var number_of_false = 3;
//===========================================================================================================
function getStudyWords(words_array, learn_mode)
{
    studyWordsObj = [];
    if (learn_mode === "sentence" || learn_mode === "paragraf")
    {
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
    }
    if (learn_mode === "page")
    {
        studyWordsObj = pageWordsObj;
    }
    return studyWordsObj;
}
//===========================================================================================================

function fillTestTable(words_array, index)
{
    //$("#word-test-box tr").remove();
    if (words_array.length > 0)
    {
        $("#word-test-box tbody").append(
            '<tr>' +
            '<td><button type="button" class="btn btn-primary text-center">' + words_array[index].Eng + '</button ></td > ' +
            '</tr > '
        );
        
    }
    //for (var i = 0; i < words_array.length; i++)
    //{
    //    $("#word-test-box tbody").append(
    //        '<tr>' +
    //        '<td><button type="button" class="btn btn-primary text-center">' + words_array[i].Eng + '</button ></td > ' +
    //        '<td><button type="button" class="btn btn-primary text-center">' + words_array[i].Rus + '</button></td>' +
    //        '</tr > '
    //    );
    //}
}
//============================================================================================================
function btnNextTest_Click()
{
    words_index++;
    if (words_index < studyWordsArray.length)
    {
        fillTestTable(studyWordsArray, words_index);
    }
    if (words_index >= studyWordsArray.length)
    {
        words_index = 0;
        fillTestTable(studyWordsArray, words_index);
    }
    
}
//============================================================================================================
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}
