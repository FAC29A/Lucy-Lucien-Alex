// Load environment variables from .env file
require("dotenv").config();

// Import necessary classes from discord.js library
<<<<<<< HEAD
const { Client, Events, GatewayIntentBits } = require("discord.js");
const commandActions = require("./commands");
const jokes = require("./jokes.js");

//Array that will contain the history
const history = require("./history");
=======
const { Client, Events, GatewayIntentBits } = require('discord.js')
const commandActions = require('./commands')
const jokes = require('./jokes.js')

//Array that will contain the history
const history = require('./history')
>>>>>>> main

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

<<<<<<< HEAD
const prefix = "!"; // Set your desired command prefix
=======
const prefix = '!' // Set your desired command prefix
>>>>>>> main

client.once(Events.ClientReady, (createdClient) => {
  console.log(`Ready! Logged in as ${createdClient.user.tag}`);
  //
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

<<<<<<< HEAD
  console.log(`Message from ${message.author.tag}: ${message.content}`);
  history.push(`Message from ${message.author.tag}: ${message.content}`);

  if (message.content.startsWith(prefix)) {
    const command = message.content.slice(prefix.length).trim().split(/ +/)[0];
    history.push(`Meesage from bot: ${command}`);

    if (command in commandActions) {
      commandActions[command](message);
    } else {
      console.log(`Command not found: ${command}`);
      history.push(`Command not found: ${command}`);
    }
  }
});
=======
	console.log(`Message from ${message.author.tag}: ${message.content}`)
	history.push(`Message from ${message.author.tag}: ${message.content}`)

	if (message.content.startsWith(prefix)) {
		const command = message.content.slice(prefix.length).trim().split(/ +/)[0]
		history.push(`Meesage from bot: ${command}`)

		if (command in commandActions) {
			commandActions[command](message)
		} else {
			console.log(`Command not found: ${command}`)
			history.push(`Command not found: ${command}`)
		}
	}
})
>>>>>>> main

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
