var five = require("johnny-five");
var MockFirmata = require("johnny-five/test/util/mock-firmata.js");
var Cleverbot = require("cleverbot-node");
var say = require("say");

var i = 0;

var chatbots = [{
  "name": "Alex",
  "voice": "Alex",
  "clever": new Cleverbot(),
  "board": new five.Board({
    io: new MockFirmata()
  }),
  "ready": false,
  "mouth": new five.Servo({
    pin: 9,
    range: [75, 125]
  }),
  "eyes": new five.Servo({
    pin: 10,
    range: [90, 105]
  })
},{
  "name": "Victoria",
  "voice": "Victoria",
  "clever": new Cleverbot(),
  "board": new five.Board({
    io: new MockFirmata()
  }),
  "ready": false,
  "mouth": new five.Servo({
    pin: 9,
    range: [75, 125]
  }),
  "eyes": new five.Servo({
    pin: 10,
    range: [90, 105]
  })
}];

var chat = function(bot, statement) {
  console.log(bot.name + ": ", statement);
  bot.mouth.sweep();
  say.speak(bot.voice || bot.name, statement, function() {
    bot.mouth.stop();
    bot.clever.write(statement, function(resp) {
      i = (i === chatbots.length-1) ? 0 : i+1;
      chat(chatbots[i], resp.message);
    });
  });
}

var blink = function(bot) {
  
}

var start = function() {
  // Wait until all ready events fired
  if(!chatbots.every(function(bot) {
      return bot.ready;
  })) { return; }

  chat(
    chatbots[i],
    "Hi there, " + chatbots[i+1].name + ". How are you today?"
  );


}

chatbots.forEach(function(bot) {
  bot.board.on("ready", function() {
    console.log(bot.name, "ready");
    bot.ready = true;

    start();
  });
});

