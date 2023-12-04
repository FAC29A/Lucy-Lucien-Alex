# Lucy-Lucien-Alex

# Custom commands

<aside>
💡 **Command Processing**: As a back-end developer, I want to process commands directed at my bot by using string matching or a command prefix to distinguish between general messages and commands meant for the bot.

</aside>

[x] 1. **Command Prefix Setting**: As a developer, I want to set a command prefix for my bot, so it can recognise when a message is a command. For instance, using "!" before a command (like **`!help`**).
2. **Help Command**: As a developer, I want to implement a **`help`** command, so that when a user types **`!help`**, the bot will send a message listing all available commands and their descriptions.
3. **Greetings Command**: As a developer, I want to create a **`greet`** command, so that when a user types **`!greet`**, the bot will respond with a personalised greeting message, like "Hello, [username]!"
4. **Random Joke Command**: As a developer, I want to add a **`joke`** command, so that when a user types **`!joke`**, the bot will respond with a random joke.
5. **Echo Command**: As a developer, I want to implement an **`echo`** command, so that when a user types **`!echo [message]`**, the bot will repeat the message back to them.
6. **Command Logging**: As a developer, I want the bot to log the use of commands, so I can

---

1. **Weather Information Command**: As a developer, I want to implement a **`weather`** command, so users can type **`!weather [city name]`** to get the current weather information for a specified city. This will involve integrating an external weather API.
2. **Poll Creation Command**: As a developer, I want to create a **`poll`** command, so that users can create interactive polls in the chat by typing **`!poll [question] [option1] [option2] ...`**. The bot should be able to tally votes and display results.
3. **Music Play Command**: As a developer, I want to implement a **`play`** command for music, so that users can play music in a voice channel by typing **`!play [song name or URL]`**. This requires handling audio streams and interfacing with Discord's voice channels.

---

- **Error Handling**: As a beginner, I want to implement error handling in my bot interactions using **`try...catch`** within my **`async`** functions to manage exceptions and provide error messages if something goes wrong.


# Handling mentions and DM Functionalities

*Try to implement **`some`** of the following user stories, you won’t have time to complete them all!*

---

As a developer, I want the bot to detect when it is mentioned in a message. This will involve the bot recognising its own user ID in message content.

<aside>
💡 **Hint**: Utilise the **`user.send()`** method in Discord.js to send direct messages to users. Retrieve the user object through events or commands that the bot receives.

</aside>

1. **Automated Response to Mentions**: As a developer, I want the bot to automatically respond when it is mentioned. For example, the bot could reply with a standard message like `**Hello! How can I assist you today?**` whenever it is tagged in a chat.
2. **Custom Response Based on Context**: As a developer, I want the bot to give a custom response based on the context of the mention. If the mention is part of a question, the bot should respond accordingly, or if it's part of a greeting, the bot should reply with a greeting.
3. **Command Execution via Mention**: As a developer, I want the bot to execute commands when mentioned along with a command keyword. For instance, if a user types `**@BotName help**`, the bot should treat this as if the user typed `**!help**`.
4. **Mention Logging**: As a developer, I want the bot to log mentions, so I can track how often and in what context the bot is being mentioned, which can help in further improving interaction handling.

---

As a developer, I want the bot to recognise when a message is a direct message (DM) as opposed to a public channel message. This will enable the bot to respond appropriately based on the context of the message.

<aside>
💡 **Hint: H**andle incoming messages by setting up a message event listener using **`client.on('message', callback)`** to process messages received in Discord

</aside>

1. **Automated DM Response**: As a developer, I want the bot to automatically send a response when it receives a direct message. For example, the bot could reply with a message like **`Hello! How can I help you?`** whenever a user sends it a DM.
2. **Command Handling in DMs**: As a developer, I want the bot to handle commands sent via direct messages. Commands that are accessible in public channels should also work in DMs, allowing users to interact with the bot privately.
3. **Proactive DM Sending**: As a developer, I want the bot to be able to send direct messages proactively to users, for instance, to send notifications or updates. This requires the bot to initiate a conversation based on certain triggers or conditions.
4. **Privacy and Permissions Check**: As a developer, I want the bot to check user privacy settings and permissions before sending direct messages. The bot should respect user privacy and server settings to avoid unwanted or intrusive interactions.
5. **Differentiated Response Strategies**: As a developer, I want the bot to employ different response strategies for public channel messages and DMs. The bot might provide more detailed help or sensitive information in DMs while keeping public channel interactions more general.
6. **User Feedback Collection via DM**: As a developer, I want the bot to collect user feedback via direct messages. This could involve the bot sending a DM to ask for feedback after performing a task or responding to a command.
7. **Error Handling in DMs**: As a developer, I want the bot to handle errors or invalid commands in DMs gracefully. The bot should provide clear guidance or assistance if users encounter issues while interacting through direct messages.


# Running the Bot on a Raspberry PI.

## Install pm2 globally using npm:

```bash
sudo npm install pm2 -g
```
## Running Your Bot with pm2

Start your bot with pm2 by navigating to your bot's directory and running:

```bash
pm2 start bot.js --name discord-bot
```

Replace bot.js with the main file of your Discord bot. The --name flag is optional and helps you identify your process easily.

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
