class Commands {
  constructor(message, author) {
    this.message = message;
    this.author = author;
  }

  run(message) {
    var cmd = message.content.slice(1).split(' ',1)[0];
    console.log(cmd);
    var args = message.content.slice(cmd.length + 1).split(',');
    args = args.map(element => element.trim());
    console.log(args);

    try {this[cmd](message, args);}
    catch(err) {
      message.channel.send('Invalid command');
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

  kunc(kuncSets) {
    var kuncAnswerId = Math.floor(Math.random() * 411);
    console.log(kuncAnswerId);
    var kuncSpecies = kuncSets[kuncAnswerId][0];
    console.log(kuncSpecies);
    var kuncMoves = [];
  
    for (let i = 0; i < 4; i++) {
      kuncMoves.push(kuncSets[kuncAnswerId][1][i][0]);
    }
    kuncMoves = kuncMoves.join(', ');
    console.log(kuncMoves);

    return {"species": kuncSpecies, "moves": kuncMoves};
  }
}

module.exports = Commands;
