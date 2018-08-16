
class Commands {
  constructor() {
    this.kuncSets = require('./kuncSets.json');
    console.log('Kunc sets loaded');
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
      message.channel.send('Invalid command ' + err);
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
}

module.exports = Commands;
