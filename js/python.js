const PythonShell = require('python-shell');

var options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python3'
};

// pythonOptions: ['-u'],
//     scriptPath: 'path/to/my/scripts',
//     args: ['value1', 'value2', 'value3']


const chatbot = './python/chatbot.py';

const pyshell = new PythonShell(chatbot, options);

const translate = require('./translate');

const index = require('../index');

let id = 0;

exports.id = function() {
    id = 0;
}

exports.send = function(data, text, chatId) {

    id = chatId;
    pyshell.send(text);

    if (id === 0) {

    }
};

pyshell.send('');

pyshell.on('message', function (message) {

    if (message !== undefined && message !== '') {

        message = message.replace(/>/g, "").trim();

        if (message === "Creating model...")
            return;

        if (message === "Restoring weights...") {

            // viewReady();
            // translateEnReceive("Ready.");
            console.log("Ready.");
            index.bot("59407517", "Ready.");
            return;
        }

        // console.log(message);
        translate.EnReceive(message, id);
        // id = 0;
    }
});


