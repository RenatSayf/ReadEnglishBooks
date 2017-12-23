var words_index = 0;
var studyWordsArray = [];
var ruWordsArray = [];
var number_of_false = 2;
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
    //randomWords.set(studyWordsObj);
    return studyWordsObj;
}
//===========================================================================================================

function fillTestTable(words_array, index)
{
    $("#word-test-box tr").remove();
    if (words_array.length > 0)
    {
        $("#word-test-box tbody").append(
            '<tr>' +
            '<td><button type="button" class="btn text-center">' + words_array[index].Eng + '</button ></td > ' +
            '</tr > '
        );        
    }

    var arr = words_array.filter(item => item !== words_array[index]);
    randomWords.set(arr);
    var random_words = [];
    random_words = randomWords.get(number_of_false);
    random_words.push(words_array[index].Rus);
    random_words.sort(compareRandom);

    for (var i = 0; i < random_words.length; i++)
    {
        $("#word-test-box tbody").append(
            '<tr>' +
            '<td><button type="button" class="btn btn-primary text-center">' + random_words[i] + '</button ></td > ' +
            '</tr > '
        );
    }

    var random_word = randomWord.get();
    
    return;
}
//============================================================================================================
function compareRandom()
{
    return Math.random() - 0.5;
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
var randomWords =
    {
        list: [],
        already: [],
        words: [],
        random: function ()
        {
            return this.list[Math.floor(Math.random() * this.list.length)];
        },
        get: function (count)
        {
            var word;
            for (var i = 0; i < count; i++)
            {
                word = this.random();
                if (this.already.length >= this.list.length)
                {
                    this.already = [];
                    this.words.push(word);
                }
                if (this.already.indexOf(word) !== -1)
                {
                    return this.get(number_of_false);
                } else
                {
                    this.already.push(word);
                    this.words.push(word);
                }
            }
            return this.words;
        },
        set: function (study_words_arr)
        {
            this.list = [];
            this.words = [];
            for (var i = 0; i < study_words_arr.length; i++)
            {
                this.list.push(study_words_arr[i].Rus);
            }
            this.already = [];
        }
    };
//============================================================================================================
