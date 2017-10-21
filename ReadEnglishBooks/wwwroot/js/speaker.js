function speech(en_word, ru_word)
{
    $('#audio').attr('src', '@Url.Action("Speech", "Speech")?enword=' + en_word + '&ruword=' + ru_word);
    $('#audio')[0].play();
}