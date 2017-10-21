function speech(en_word)
{
    $('#audio').attr('src', '@Url.Action("Speak", "Speech")?enword=' + en_word);
    $('#audio')[0].play();
}