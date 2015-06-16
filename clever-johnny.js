var five = require("johnny-five");
var Cleverbot = require("cleverbot-node");
var say = require("say");

var i = 0;

var chatbots = [{
  "name": "Alex",
  "voice": "Alex",
  "clever": new Cleverbot(),
  "board": new five.Board(),
  "ready": false
},{
  "name": "Victoria",
  "voice": "Victoria",
  "clever": new Cleverbot(),
  "board": new five.Board(),
  "ready": false
}];

var chat = function(bot, statement) {
  console.log(bot.name + ": ", statement);
  bot.mouth.sweep();
  say.speak(bot.voice || bot.name, statement, function() {
    bot.mouth.stop().to(90);
    bot.clever.write(statement, function(resp) {
      i = (i === chatbots.length-1) ? 0 : i+1;
      chat(chatbots[i], resp.message);
    });
  });
}

var blink = function(bot) {
  
}

var initServos = function(bot) {
  bot.mouth = new five.Servo({
    pin: 10,
    range: [0, 90],
    board: bot.board
  });
}

var start = function() {
  // Wait until all ready events fired
  if(!chatbots.every(function(bot) {
      return bot.ready;
  })) { return; }

  chatbots.forEach(function(bot) {
    initServos(bot);
  });

  chat(
    chatbots[i],
    "Hi there, " + chatbots[i+1].name + ". How are you today?"
  );


}

chatbots.forEach(function(bot) {
  bot.clever.prepare();
  bot.board.on("ready", function() {
    console.log(bot.name, "ready");
    bot.ready = true;

    start();
  });
});

