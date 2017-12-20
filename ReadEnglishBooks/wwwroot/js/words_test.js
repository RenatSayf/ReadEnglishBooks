var words_index = 0;
var studyWordsArray = [];
var ruWordsArray = [];
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
    randomWord.set(studyWordsObj);
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

    var random_word = randomWord.get();
    return;
}
//============================================================================================================
var randomWord =
    {
        list: [],
        already: [],
        random: function ()
        {
            return this.list[Math.floor(Math.random() * this.list.length)];
        },
        get: function ()
        {
            var word;
            word = this.random();
            if (this.already.length >= this.list.length)
            {
                this.already = [];
                return word;
            }
            if (this.already.indexOf(word) !== -1)
            {
                return this.get();
            } else
            {
                this.already.push(word);
                return word;
            }
        },
        set: function (study_words_arr)
        {
            for (var i = 0; i < study_words_arr.length; i++)
            {
                this.list.push(study_words_arr[i].Rus);
            }
            this.already = [];
        }
    };
//============================================================================================================
