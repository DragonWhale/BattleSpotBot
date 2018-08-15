'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const command = require('./commands.js');
const commands = new command();
const kuncSets = require('./kuncSets.json');
const config = require('./config.json')


const token = config.token;
const prefix = '!';

client.on('ready', () => {
  console.log('I am ready!');
});

//declare global kunc variables
var kunc = false;
var kuncResult = {};

client.on('message', message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!kunc') && !kunc) {
    kunc = true;
    kuncResult = commands.kunc(kuncSets);
    message.channel.send(kuncResult.moves + '\nUse ``!guess pokemon`` to guess!')
  }

  else if (message.content.startsWith('!guess') && kunc) {
    var guess = message.content.slice(7).toLowerCase();
    console.log(guess);
    if(guess === kuncResult.species.toLowerCase()) {
      message.channel.send(message.author + ' got it right! It was ' + kuncResult.species + '!');
      kunc = false;
    }
  }

  else if (message.content.startsWith(prefix)) {
    commands.run(message);
  }
});

client.login(token);
