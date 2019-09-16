
class Commands {
  constructor() {
    this.kuncSets = require('./kuncSets.json');
    console.log('Kunc sets loaded');
    this.tourData = require('./tourData.json');
    console.log('Tour Data loaded');
    this.kuncStatus = {};
    this.kuncScores = {};
  }

  run(message) {
    var cmd = message.content.slice(1).split(' ',1)[0];
    console.log(cmd);
    var args = message.content.slice(cmd.length + 1).split(',');
    args = args.map(element => element.trim());
    console.log(args);

    try {this[cmd](message, args);}
    catch(err) {
      message.channel.send('Invalid command. ' + err);
    }
  }

  test(message) {
    message.channel.send('Test Successful');
  }

  help(message, args) {
    var cmdSummary = {
      "roll" : "!roll <number> : rolls a <number> sided dice",
      "pick" : "!pick <1>, <2>, ... : picks one between all the elements",
      "kunc" : "!kunc : starts a kunc game"
    }

    if(cmdSummary[args[0]] === undefined) {
      message.author.send('List of available commands: !roll, !pick, !kunc\nDetails with !help <command>');
    }

    else message.author.send(cmdSummary[args[0]]);
  }

  roll(message, args) {
    var dice;

    if(args[0].length === 0) {
      dice = 6;
    } else if(parseInt(args[0])) {
      dice = parseInt(args[0]);
    } else {
      message.channel.send('Invalid argument: expected an integer');
    }

    var result = Math.floor(Math.random() * dice) + 1;
    message.channel.send('You rolled a ' + result);
  }

  kunc(message, args) {
    //don't start kunc in a room that's already running kunc
    if (this.kuncStatus.hasOwnProperty(message.channel.id)) {
      if(this.kuncStatus[message.channel.id].running) return;
    }

    this.kuncScores[message.channel.id] = {};

    this.kuncGenerator(message);
  }

  kuncGenerator(message) {
    //ignore if it's called directly
    if(message.content.startsWith('!kuncGenerator')) {
      message.channel.send('Invalid command');
      return;
    }

    var kuncAnswerId = Math.floor(Math.random() * 411);
    var kuncSpecies = this.kuncSets[kuncAnswerId][0];
    var kuncMoves = this.kuncSets[kuncAnswerId][1];
    console.log(kuncSpecies);
    var kuncQuestion = [];

    for (let i = 0; i < kuncMoves.length; i++) {
      kuncQuestion.push(kuncMoves[i][0]);
    }
    kuncQuestion = kuncQuestion.join(', ');
    console.log(kuncQuestion);

    var kuncGameState = {
      "running" : true,
      "answer" : kuncSpecies,
      "question" : kuncQuestion,
    };

    this.kuncStatus[message.channel.id] = kuncGameState;

    message.channel.send(kuncQuestion + '\nUse ``!guess/!g pokemon`` to guess!');
  }

  g(message, args) {
    this.guess(message, args);
  }

  guess(message, args) {
    //only run if there's a kunc game in the room
    if (this.kuncStatus.hasOwnProperty(message.channel.id)) {
      if (this.kuncStatus[message.channel.id].running) {
        var guess = args[0].toLowerCase();
        if(guess === this.kuncStatus[message.channel.id].answer.toLowerCase()) {

          if(this.kuncScores[message.channel.id].hasOwnProperty(message.author)) {
            this.kuncScores[message.channel.id][message.author]++;
          } else {
            this.kuncScores[message.channel.id][message.author] = 1;
          }

          message.channel.send(message.author + ' got it right and has **' + this.kuncScores[message.channel.id][message.author] + '** point(s)! It was ' + this.kuncStatus[message.channel.id].answer + '!');

          if(this.kuncScores[message.channel.id][message.author] === 5) {
            message.channel.send('Game Over! ' + message.author + 'won!');
            this.kuncStatus[message.channel.id].running = false;
          } else {
            this.kuncGenerator(message);
          }
        }
      } else {
        message.channel.send('No kunc game running');
      }
    } else {
      message.channel.send('No kunc game running');
    }
  }

  tourstats(message, args) {
    if(args[0] === 'help') {
      message.channel.send('``tourstats <Pokemon>, <Generation (default 7)>, <Singles = 1/Doubles = 2 (default 1)>\nDisplays stats of Pokemon from official Battle Spot matches.``');
    }

    var pokemon = args[0];
    var format = '';

    switch (args[1]) {
      case '5':
      format = 'gbuSingles';
      case '6':
      switch (args[2]) {
        case '1':
        format = 'orasSingles';
        case '2':
        format = 'orasDoubles';
        break;
        default: format = 'orasSingles';
      }
      case '7':
      switch (args[2]) {
        case '1':
        format = 'smSingles';
        case '2':
        format = 'smDoubles';
        break;
        default: format = 'smSingles';
      }
      break;
      default: format = 'smSingles';
    }

    //check if Pokemon was used in the format
    if(Object.keys(this.tourData[format]).findIndex(key => key.toLowerCase() === pokemon.toLowerCase()) === -1) {
      message.channel.send('This Pokemon was not used in an official match of ' + format + '.');
      return;
    }

    var pokeObj = this.tourData[format][pokemon];

    message.channel.send('```Pokemon: ' + pokeObj.name + '    Format: ' + format + '\nRank: ' + pokeObj.rank + '\nUsage: ' + pokeObj.count + ' (' + pokeObj.usage + ')   Wins: ' + pokeObj.win + ' (' + pokeObj.winPercent + ')\nBrought: ' + pokeObj.bring + ' (' + pokeObj.bringPercent + ')   Wins: ' + pokeObj.bringWin + ' (' + pokeObj.bringWinPercent + ')```');




  }
}

module.exports = Commands;
