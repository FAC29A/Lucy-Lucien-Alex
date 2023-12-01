# Lucy-Lucien-Alex

# Custom commands

<aside>
💡 **Command Processing**: As a back-end developer, I want to process commands directed at my bot by using string matching or a command prefix to distinguish between general messages and commands meant for the bot.

</aside>

1. **Command Prefix Setting**: As a developer, I want to set a command prefix for my bot, so it can recognise when a message is a command. For instance, using "!" before a command (like **`!help`**).
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
