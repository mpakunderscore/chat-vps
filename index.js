const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
//TODO add new token
const token = '405379098:AAEPUIWJ4fCwME-bVCY_9hDgr7yzcUvKUgI';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


const python = require('./js/python');
const translate = require('./js/translate');


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {

    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id,
        "A toy chatbot powered by deep learning and trained on data. \n" +
        "Try to play with the arguments to obtain better samples:\n" +
        "\n" +
        "/beam 2\n" +
        "/temperature 1.0\n" +
        "/relevance 1.0\n" +
        "/reset", {});
});

bot.onText(/\/beam/, (msg) => {

    const chatId = msg.chat.id;

    let value = msg.text.replace("/beam", "").trim();

    if (value === "") {

        bot.sendMessage(msg.chat.id,
            "beam_width: By default, chatbot.py will use beam search with a beam width of 2 to sample responses. " +
            "Set this higher for more careful, more conservative (and slower) responses, " +
            "or set it to 1 to disable beam search.");

    } else {

        let command = "--beam_width " + value;
        python.send(null, command, chatId);

        bot.sendMessage(msg.chat.id,
            "Beam width: " + value);
    }
});

bot.onText(/\/temperature/, (msg) => {

    const chatId = msg.chat.id;

    let value = msg.text.replace("/temperature", "").trim();

    if (value === "") {

        bot.sendMessage(msg.chat.id,
            "temperature: At each step, the model ascribes a certain probability to each character. " +
            "Temperature can adjust the probability distribution. 1.0 is neutral (and the default), " +
            "lower values increase high probability values and decrease lower probability values " +
            "to make the choices more conservative, and higher values will do the reverse. " +
            "Values outside of the range of 0.5-1.5 are unlikely to give coherent results." );

    } else {

        let command = "--temperature " + value;
        python.send(null, command, chatId);

        bot.sendMessage(msg.chat.id,
            "Temperature: " + value);
    }

});

bot.onText(/\/relevance/, (msg) => {

    const chatId = msg.chat.id;

    let value = msg.text.replace("/relevance", "").trim();

    if (value === "") {

        bot.sendMessage(msg.chat.id, "relevance: Two models are run in parallel: the primary model and the mask model. " +
            "The mask model is scaled by the relevance value, and then the probabilities of the primary model are combined according to equation 9 in Li, " +
            "Jiwei, et al. \"A diversity-promoting objective function for neural conversation models.\" " +
            "arXiv preprint arXiv:1510.03055 (2015). The state of the mask model is reset upon each newline character. " +
            "The net effect is that the model is encouraged to choose a line of dialogue that is most relevant to the prior line of dialogue, " +
            "even if a more generic response (e.g. \"I don't know anything about that\") may be more absolutely probable. " +
            "Higher relevance values put more pressure on the model to produce relevant responses, at the cost of the coherence of the responses. " +
            "Going much above 0.4 compromises the quality of the responses. Setting it to a negative value disables relevance, and this is the default, " +
            "because I'm not confident that it qualitatively improves the outputs and it halves the speed of sampling." );

    } else {

        let command = "--relevance " + value;
        python.send(null, command, chatId);

        bot.sendMessage(msg.chat.id,
            "Relevance: " + value);

    }
});

bot.onText(/\/reset/, (msg) => {

    const chatId = msg.chat.id;

    let command = "--reset";
    python.send(null, command, chatId);

    // python.id();

    bot.sendMessage(msg.chat.id,
        "Reset.");
});


bot.onText(/\/test/, (msg) => {

    const chatId = msg.chat.id;

    msg.text = msg.text.replace("/beam", "").trim();

    translate.RuSend(msg, chatId);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {

    const chatId = msg.chat.id;

    if (msg.sticker !== undefined) {

        msg.text = msg.sticker.emoji;

        translate.RuSend(msg, chatId);

    } else {

        translate.RuSend(msg, chatId);
    }

    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message');
});

exports.bot = function(chatId, text) {

    if (text === "")
        text = "-_ -";

    bot.sendMessage(chatId, text);
}
