# Lucy-Lucien-Alex

# Custom commands

- `!ping`: Replies with "Pong!" to check if the bot is responsive.
- `!hello`: Greets the user with a friendly "Hi there!".
- `!joke`: Shares a random joke from the bot's collection.
- `!echo`: Repeats the user's message, excluding the "!echo" command.
- `!history`: Sends the chat history stored by the bot.
- `!ask`: Engages in a conversation with the OpenAI GPT-3.5 Turbo model.
- `!help`: Displays a list of available commands based on the channel type.
- `!poll`: Conducts a poll based on user-provided options. Example usage:`!poll [question] [option1] [option2] ...`.The bot will be able to tally votes and display results.
- `!myid` (_DM exclusive_): Sends the user's Discord ID in a DM.

Description of what is happening in the images

<img width="530" alt="Screenshot 2023-12-06 at 10 26 07" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/93b7e073-f263-45ea-b061-24c70cd7f485">
<img width="767" alt="Screenshot 2023-12-06 at 10 27 19" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/e1770f45-89d8-4739-aa21-c200938ef81d">

---

### Conversation History

When a user begins a conversation with our bot by using the `!ask` command or by tagging it, our bot begin to log all conversation history that can later be accessed on demand. Our history gets logged in two different ways:

- **Locally:** The `history` function handles the **Command Logging**. This gets logged localy in `history.js`.
- **OpenAI API storage:** By using and accessing the ChatGPT API, the user can ask the bot for a complete conversation history.

We chose to implement both options for texting / debugging purposes. We handled the local history to aid with our bot building, particularly commands. OpenAI API's storage is more powerful, and will be the preferred logging method once the Bot is fully operational.

# Use of OpenAI API

When starting a conversation the bot (using the command `!ask` tagging the bot or just having a private converstion ,will try to guess the name of the user who invoqued it by their Discord username. If the real name is not present on the Discord user it will just ommit it.

- [ ] 3. **Music Play Command**: As a developer, I want to implement a **`play`** command for music, so that users can play music in a voice channel by typing **`!play [song name or URL]`**. This requires handling audio streams and interfacing with Discord's voice channels.

---

- - [x] **Error Handling**: As a beginner, I want to implement error handling in my bot interactions using **`try...catch`** within my **`async`** functions to manage exceptions and provide error messages if something goes wrong.

# Handling mentions and DM Functionalities

_Try to implement **`some`** of the following user stories, you won’t have time to complete them all!_

---

As a developer, I want the bot to detect when it is mentioned in a message. This will involve the bot recognising its own user ID in message content.

<aside>
💡 **Hint**: Utilise the **`user.send()`** method in Discord.js to send direct messages to users. Retrieve the user object through events or commands that the bot receives.

</aside>

- [x] 1. **Automated Response to Mentions**: As a developer, I want the bot to automatically respond when it is mentioned. For example, the bot could reply with a standard message like `**Hello! How can I assist you today?**` whenever it is tagged in a chat.
- [x] 2. **Custom Response Based on Context**: As a developer, I want the bot to give a custom response based on the context of the mention. If the mention is part of a question, the bot should respond accordingly, or if it's part of a greeting, the bot should reply with a greeting.
- [x] 3. **Command Execution via Mention**: As a developer, I want the bot to execute commands when mentioned along with a command keyword. For instance, if a user types `**@BotName help**`, the bot should treat this as if the user typed `**!help**`.
- [x] 4. **Mention Logging**: As a developer, I want the bot to log mentions, so I can track how often and in what context the bot is being mentioned, which can help in further improving interaction handling.

---

As a developer, I want the bot to recognise when a message is a direct message (DM) as opposed to a public channel message. This will enable the bot to respond appropriately based on the context of the message.

<aside>
💡 **Hint: H**andle incoming messages by setting up a message event listener using **`client.on('message', callback)`** to process messages received in Discord

</aside>

- [x] 1. **Automated DM Response**: As a developer, I want the bot to automatically send a response when it receives a direct message. For example, the bot could reply with a message like **`Hello! How can I help you?`** whenever a user sends it a DM.
- [x] 2. **Command Handling in DMs**: As a developer, I want the bot to handle commands sent via direct messages. Commands that are accessible in public channels should also work in DMs, allowing users to interact with the bot privately.
- [x] 3. **Proactive DM Sending**: As a developer, I want the bot to be able to send direct messages proactively to users, for instance, to send notifications or updates. This requires the bot to initiate a conversation based on certain triggers or conditions.
- [x] 4. **Privacy and Permissions Check**: As a developer, I want the bot to check user privacy settings and permissions before sending direct messages. The bot should respect user privacy and server settings to avoid unwanted or intrusive interactions.
- [x] 5. **Differentiated Response Strategies**: As a developer, I want the bot to employ different response strategies for public channel messages and DMs. The bot might provide more detailed help or sensitive information in DMs while keeping public channel interactions more general.
- [ ] 6. **User Feedback Collection via DM**: As a developer, I want the bot to collect user feedback via direct messages. This could involve the bot sending a DM to ask for feedback after performing a task or responding to a command.
- [ ] 7. **Error Handling in DMs**: As a developer, I want the bot to handle errors or invalid commands in DMs gracefully. The bot should provide clear guidance or assistance if users encounter issues while interacting through direct messages.

# Running the Bot on a Raspberry PI.

## Install pm2 globally using npm:

```bash
sudo npm install pm2 -g
```

## Running Your Bot with pm2

Start your bot with pm2 by navigating to your bot's directory and running:

```bash
pm2 start script.js --name discord-bot
```

Replace script.js with the main file of your Discord bot. The --name flag is optional and helps you identify your process easily.

## Managing Your Bot

To check the status of your bot, use:

```bash
pm2 status
```

To view detailed logs of your bot:

```bash
pm2 logs discord-bot
```

To restart your bot:

```bash
pm2 restart discord-bot
```

To stop your bot:

```bash
pm2 stop discord-bot
```

## Setting Up pm2 to Start on Boot

To make sure your bot starts automatically after a reboot, use the following command:

```bash
pm2 startup
```

This command will generate a line that you need to copy and run in the terminal. It sets up a script that will start pm2 with your saved processes on boot.

After setting up the startup script, save the current list of processes:

```bash
pm2 save
```

Now, your bot should continue running even after closing the PuTTY session, and it will automatically start after the Raspberry Pi reboots.
