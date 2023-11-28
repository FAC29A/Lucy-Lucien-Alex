// Data structure were we store all the commands
const commandActions = {
  ping: (message) => sendMessage(message, "Pong!"),
  hello: (message) => sendMessage(message, "Hi there!"),
  randomJoke: (message) => randomJoke(message),
  help: sendHelpMessage,
  echo: echoMessage,
  // Add more commands and actions here
};

function sendMessage(message, response) {
  message.reply(response);
}

function sendHelpMessage(message) {
  const helpText =
    'Available commands:\n\t!hello: returns "Hi There"\n\t!ping: returns "Pong!"';
  message.reply(helpText);
}

function randomJoke(message) {
  message.reply();
}

function echoMessage(message) {
  // The resason of slice(5) is because there are 5 character in !echo
  const messageWithoutPrefix = message.content.slice(5).trim();
  message.reply(messageWithoutPrefix);

  console.log(message);
}

module.exports = commandActions;
