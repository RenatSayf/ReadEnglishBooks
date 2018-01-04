var words_index = 0;
var studyWordsArray = [];
var ruWordsArray = [];
var number_of_false = 2;
var counter_right_answers = 0;
//===========================================================================================================
function getStudyWords(words_array, learn_mode)
{
    words_index = 0;
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
    $("#word-test-box tbody tr").remove();
    try
    {
        if (words_array.length > 0)
        {
            $("#word-test-box tbody").append(
                '<tr>' +
                '<td><button type="button" class="btn btn-default text-center">' + words_array[index].Eng + '</button ></td > ' +
                '</tr > '
            );

            var random_words = [];
            if (words_array.length > number_of_false)
            {
                var arr = words_array.filter(item => item !== words_array[index]);
                randomWords.set(arr);
                random_words = randomWords.get(number_of_false);
                random_words.push(words_array[index].Rus);
                random_words.sort(compareRandom);
            }
            else
            {
                for (var i = 0; i < words_array.length; i++)
                {
                    random_words.push(words_array[i].Rus);
                }
            }

            for (var j = 0; j < random_words.length; j++)
            {
                $("#word-test-box tbody").append(
                    '<tr>' +
                    '<td><button type="button" class="btn btn-primary text-center" onclick="return btnRuWord_OnClick(this)">' + random_words[j] + '</button ></td > ' +
                    '</tr > '
                );
            }
        }
    } catch (e)
    {
        if (index >= words_array.length)
        {
            if (counter_right_answers < 0)
            {
                counter_right_answers = 0;
            }
            $("#word-test-box tbody tr").remove();
            $("#word-test-box tbody").append(
                '<tr>' +
                '<td>Завершено!!!</td > ' +
                '<td>Правильно - </td > ' +
                '<td>' + counter_right_answers + ' из ' + words_array.length + '</td > ' +
                '</tr > '
            );
        }
    }
    return;
}
//============================================================================================================
function compareRandom()
{
    return Math.random() - 0.5;
}
//============================================================================================================
function nextTest()
{    
    if (words_index < studyWordsArray.length)
    {
        words_index++;
        fillTestTable(studyWordsArray, words_index);
    }
    if (words_index > studyWordsArray.length - 1)
    {
        words_index = 0;
        counter_right_answers = 0;
        //fillTestTable(studyWordsArray, words_index);
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
                    this.words = [];
                    this.already = [];
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
function btnRuWord_OnClick(sender)
{
    var pairs_background_color = "background-color:#00ff00";
    var wrong_background_color = "background-color:#ff0000";
    var en_word = $("#word-test-box tbody button")[0].innerText;
    var ru_word = sender.innerText;
    var en_array = [];
    var ru_array = [];
    for (var i = 0; i < studyWordsArray.length; i++)
    {
        en_array.push(studyWordsArray[i].Eng);
        ru_array.push(studyWordsArray[i].Rus);
    }
    var marker = true;
    if (en_array.indexOf(en_word) === ru_array.indexOf(ru_word))
    {
        counter_right_answers++;
        $("#word-test-box tbody button")[0].setAttribute("style", pairs_background_color);
        sender.setAttribute("style", pairs_background_color);

        $("#word-test-box tbody button").each(function (index, element)
        {
            if (this.getAttribute("style") !== pairs_background_color)
            {
                $(this).animate({ opacity: 0.0 }, 1000, function ()
                {
                    if (marker)
                    {
                        marker = false;
                        nextTest();                        
                    }
                });                
            }
        });
    }
    else
    {
        counter_right_answers--;
        sender.setAttribute("style", wrong_background_color);
        $(sender).animate({ left: "+=50"}, 500, function ()
        {
            this.removeAttribute("style");
        });
    }
}
//============================================================================================================
function btnRepeatTest_OnClick(sender)
{
    words_index = -1;
    nextTest();
}