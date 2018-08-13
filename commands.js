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

    switch (cmd) {

      //test command
      case 'test':
        message.channel.send('Test Successful');
        break;

      //help command
      case 'help':
        message.author.send('List of available commands:\n!roll <number>: rolls a <number> sided dice');
        break;

      //dice roll command
      case 'roll':
        var dice;
        if(args[0].length === 0) {
          dice = 6;
        } else if(parseInt(args[0])) {
          dice = parseInt(args[0]);
        } else {
          message.channel.send('Invalid argument: expected an integer');
          break;
        }
        var result = Math.floor(Math.random() * dice) + 1;
        message.channel.send('You rolled a ' + result);
        break;

      //pick command
      case 'pick':
        var choice = Math.floor(Math.random() * args.length);
        message.channel.send('I pick ' + args[choice]);
        break;

      default:
        message.channel.send('Invalid command');
        break;
    }
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
