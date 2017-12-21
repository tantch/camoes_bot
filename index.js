const Telegraf = require('telegraf');
const fs = require('fs');
require('dotenv').config();

const lusiadasLink = './lusiadas.txt';
const bot = new Telegraf(process.env.TOKEN);
const data = fs.readFileSync(lusiadasLink, 'utf8');
const lines = data.split('\n');
const chatsStatus = {};

function checkChatRunning(ctx) {
  chatsStatus[ctx.chat.id] = chatsStatus[ctx.chat.id] || {};
  chatsStatus[ctx.chat.id].stanza = chatsStatus[ctx.chat.id].stanza || 1;
}

function readStanza(stanza) {
  let result = '';
  for (let index = ((stanza - 1) * 8) + 1; index < ((stanza) * 8) + 1; index += 1) {
    result += `\n ${lines[index]}`;
  }
  return result;
}

bot.command('read@camoes_bot', (ctx) => {
  checkChatRunning(ctx);
  ctx.reply(readStanza(chatsStatus[ctx.chat.id].stanza));
  chatsStatus[ctx.chat.id].stanza += 1;
});

bot.command('reset@camoes_bot', (ctx) => {
  checkChatRunning(ctx);
  chatsStatus[ctx.chat.id].stanza = 1;
  ctx.reply(`RESET: Stanza counter:${chatsStatus[ctx.chat.id].stanza}`);
});

bot.command('status@camoes_bot', (ctx) => {
  checkChatRunning(ctx);
  chatsStatus[ctx.chat.id].stanza = chatsStatus[ctx.chat.id].stanza || 1;
  ctx.reply(`I'm at stanza ${chatsStatus[ctx.chat.id].stanza}`);
});

bot.startPolling();
