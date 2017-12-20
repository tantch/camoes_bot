const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const fs = require('fs')
const token = eval(fs.readFileSync('./token')+"")
const lusiadas_link = "./lusiadas.txt"
const bot = new Telegraf(token)
const session = require('telegraf/session')

const data = fs.readFileSync(lusiadas_link, 'utf8');
const lines = data.split("\n");
var chatsStatus = {};

function checkChatRunning(ctx) {
    chatsStatus[ctx.chat.id] = chatsStatus[ctx.chat.id] || {}
    chatsStatus[ctx.chat.id].stanza = chatsStatus[ctx.chat.id].stanza || 1
}

function readStanza(stanza){
    var result="";
    for (let index = ((stanza-1)*8) +1; index < ((stanza)*8) +1; index++) {
        result += "\n"+lines[index];
    }
    return result;
}

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    callback(null, lines[+line_no]);
}

bot.command('read@camoes_bot', (ctx) => {
    checkChatRunning(ctx)
    ctx.reply(readStanza(chatsStatus[ctx.chat.id].stanza))
    chatsStatus[ctx.chat.id].stanza++
})
bot.command('reset@camoes_bot', (ctx) => {
    checkChatRunning(ctx)
    chatsStatus[ctx.chat.id].stanza = 1
    ctx.reply(`RESET: Stanza counter:${chatsStatus[ctx.chat.id].stanza}`)
})
bot.command('status@camoes_bot', (ctx) => {
    checkChatRunning(ctx)
    chatsStatus[ctx.chat.id].stanza = chatsStatus[ctx.chat.id].stanza || 1
    ctx.reply(`I\'m at stanza ${chatsStatus[ctx.chat.id].stanza}`)
})
bot.startPolling()