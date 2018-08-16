'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const command = require('./commands.js');
const commands = new command();
const config = require('./config.json')
const prefix = '!';

client.on('ready', () => {
  console.log('I am ready!');
});

//declare global kunc variables
var kunc = false;
var kuncResult = {};

client.on('message', message => {
  //don't respond to bots
  if (message.author.bot) return;

  //must be from an approved server/guild
  if (config.filterServer && message.channel.type === 'text') {
    if(!config.servers.some(x => x === message.channel.guild.id)) {
      return;
    }
  }

  //must be from an approved channel (should be used with server filters)
  if (config.filterChannel && message.channel.type === 'text') {
    if(!config.channels.some(x => x === message.channel.name)) {
      return;
    }
  }

  //must be a dm from approved users
  if (config.filterUsers && message.channel.type === 'dm') {
    if(!config.users.some(x => x === message.channel.recipient.id)) {
      return;
    }
  }

  if (message.content.startsWith(prefix)) {
    commands.run(message);
  } else {
    return;
  }
});

client.login(config.token);
