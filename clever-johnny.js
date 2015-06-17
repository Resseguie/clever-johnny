var five = require("johnny-five");
var Cleverbot = require("cleverbot-node");
var say = require("say");

var i = 0;

var chatbots = [{
  "name"   : "Alex",
  "voice"  : "Alex",
  "clever" : new Cleverbot(),
  "board"  : new five.Board(),
  "blink"  : null,
  "ready"  : false
},{
  "name"   : "Victoria",
  "voice"  : "Victoria",
  "clever" : new Cleverbot(),
  "board"  : new five.Board(),
  "blink"  : null,
  "ready"  : false
}];


var chat = function(bot, statement) {
  console.log(bot.name + ": ", statement);
  clearInterval(bot.blink);
  bot.servo.sweep({
    interval: 25,
    range: [0, 90]
  });

  statement = cleanMessage(bot, statement);

  say.speak(bot.voice || bot.name, statement, function() {
    bot.servo.stop().to(110);
    bot.blink = setInterval(function() {
      blink(bot);
    }, Math.floor(Math.random() * 3000 + 3000));

    bot.clever.write(statement, function(resp) {
      i = (i === chatbots.length-1) ? 0 : i+1;
      chat(chatbots[i], resp.message);
    });
  });
}

var blink = function(bot) {
  bot.servo.to(150);
  setTimeout(function() {
    bot.servo.to(110);
  }, 500);
};

var initServos = function(bot) {
  bot.servo = new five.Servo({
    pin: 10,
    board: bot.board
  });
};

var cleanMessage = function(bot, msg) {
  // non-greedily replace self actions indicated by *...* with 
  // something that can be spoken, like "air quotes: BotName ..."
  msg = msg.replace(/\*(.*?)\*/g, 'Air quotes: "' + bot.name + '$1' + '"');
  return msg;
};

chatbots.forEach(function(bot) {
  bot.clever.prepare();
  bot.board.on("ready", function() {
    initServos(bot);

    console.log(bot.name, "ready");
    bot.ready = true;

    // Wait until all ready events fired
    if(chatbots.every(function(bot) {
      return bot.ready;
    })) {
      chat(chatbots[0], "Hi there, what is your name?");
    }

  });
});

