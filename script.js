// Load environment variables from .env file
require("dotenv").config();

// Import necessary classes from discord.js library
const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  ChannelType,
} = require("discord.js");

const commandActions = require("./commands");
const jokes = require("./jokes.js");

//Array that will contain the history
const history = require("./history");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Command prefix
const prefix = "!";

client.once(Events.ClientReady, (createdClient) => {
  console.log(`Logged in as ${createdClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // Get the bot's user ID
  let botId = client.user.id;

  // Check if the message is a Direct Message
  if (message.channel.type === ChannelType.DM) {
    // Check if the message starts with the prefix and execute the command
    if (message.content.startsWith(prefix)) {
      executeCommand(message, botId, commandActions, prefix);
      return; // Exit the function to avoid executing the prefix check
    }
    // Send a DM response
    commandActions["ask"](message, botId);
    console.log(`Message: ${message.content}`);
    history.push(`${message.author.tag}: ${message.content}`);
    return; // Exit the function to avoid executing the prefix check
  }

  // Check if the message mentions the bot
  // add if statement, if whatever after @user is not on the command list, this will dafault the command as ask

  if (
    message.content.includes(`<@${botId}>`) ||
    message.content.includes(`<@!${botId}>`)
  ) {
    const words = message.content.split(/\s+/);
    // Find the index of the bot mention
    const botMentionIndex = words.findIndex(
      (word) => word.includes(`<@${botId}`) || word.includes(`<@!${botId}`),
    );
    // Check if there's a next word after the mention
    if (botMentionIndex < words.length - 1) {
      // Extract the next word as the command keyword
      let theWordAfterBoxid = words[botMentionIndex + 1].toLowerCase();
      let commandKeyword;

      // Check if the command keyword is in commandActions
      if (!commandActions.hasOwnProperty(theWordAfterBoxid)) {
        commandKeyword = "ask";
      } else {
        commandKeyword = theWordAfterBoxid;
      }
      // Respond to the mention with the extracted command
      commandActions[commandKeyword](message, botId);
      console.log(`Message: ${message.content}`);
      history.push(`${message.author.tag}: ${message.content}`);
      return; // Exit the function to avoid executing the prefix check
    }
  }

  history.push(`${message.author.tag}: ${message.content}`);

  if (message.content.startsWith(prefix)) {
    executeCommand(message, botId, commandActions, prefix);
  }
});

// Function to handle command execution
function executeCommand(message, botId, commandActions, prefix) {
  const command = message.content.slice(prefix.length).trim().split(/ +/)[0];

  if (command in commandActions) {
    commandActions[command](message, botId);
  } else {
    message.reply(`Command not found: ${command}`);
    console.log(`Command not found: ${command}`);
  }
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
