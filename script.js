// Load environment variables from .env file
require('dotenv').config()

// Import necessary classes from discord.js library
const { Client, Events, GatewayIntentBits } = require('discord.js')
const commandActions = require('./commands')
const jokes = require('./jokes.js')

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
})

const prefix = '!' // Set your desired command prefix

// Load the commands from the JSON file
// const commands = require('./commands.json')

client.once(Events.ClientReady, (createdClient) => {
	console.log(`Ready! Logged in as ${createdClient.user.tag}`)
	//
})

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return

	console.log(`Message from ${message.author.tag}: ${message.content}`)

	if (message.content.startsWith(prefix)) {
		const command = message.content.slice(prefix.length).trim().split(/ +/)[0]

		if (command in commandActions) {
			commandActions[command](message)
		} else {
			console.log(`Command not found: ${command}`)
		}
	}
})

// // Logic using the Json file
// if (message.content.startsWith(prefix)) {
// 	const command = message.content.slice(prefix.length).trim().split(/ +/)[0]

// 	console.log(`Received command: ${command}`)

// 	// Access the 'response' property of the command object
// 	if (commands[command] && commands[command].response) {
// 		console.log(`Responding with: ${commands[command].response}`)
// 		message.reply(commands[command].response)
// 	} else {
// 		console.log(`Command not found or response missing: ${command}`)
// 		// Optionally send a message or log that the command was not found or response is missing
// 	}
// }

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)
