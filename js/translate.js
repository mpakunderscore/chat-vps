//this does not work obviously
const apiKey = "AIzaSyDjHyP5hoIcpTvhzmBKTIlY9ycTgFRkuWM";

let googleTranslate = require('google-translate')(apiKey);

const python = require('./python');

const index = require('../index');

// let msg = new SpeechSynthesisUtterance();
// let voices = window.speechSynthesis.getVoices();
// msg.voice = voices[1]; // Note: some voices don't support altering params
// msg.voiceURI = 'native';
// msg.volume = 1; // 0 to 1
// msg.rate = 1; // 0.1 to 10
// msg.pitch = 1; //0 to 2
// msg.lang = 'en-En';

exports.EnReceive = function (text, chatId) {

    // console.log("EN < " + text);

    // pyshell.send(translation.translatedText);

    // add(text)

    // msg.text = text;
    // window.speechSynthesis.speak(msg);

    googleTranslate.translate(text, 'ru', function(err, translation) {

        if (err) {

            console.log("AI: " + text);

            index.bot(chatId, text);

            return;
        }

        console.log("AI: " + translation.translatedText);

        index.bot(chatId, translation.translatedText);
    });
};

exports.RuSend = function (text, chatId) {

    console.log("User (" + chatId + "): " + text.text);

    // add(text)

    googleTranslate.translate(text.text, 'en', function(err, translation) {

        if (err) {

            console.log(JSON.parse(err.body).error.message);

            // index.bot(chatId, JSON.parse(err.body).error.message);

            python.send(text, text.text, chatId);

            return;
        }


        // console.log("EN > " + translation.translatedText);

        // add(text, translation.translatedText, "user")

        python.send(text, translation.translatedText, chatId);
    });
}
