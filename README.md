# Lucy-Lucien-Alex


### Regular command
- 

### DM exlusive command
- !myid: return user's ID. (_In case of attemp to ask confidential info on public channel.  This command will not be available here._)
<img width="530" alt="Screenshot 2023-12-06 at 10 26 07" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/93b7e073-f263-45ea-b061-24c70cd7f485">
<img width="767" alt="Screenshot 2023-12-06 at 10 27 19" src="https://github.com/FAC29A/Lucy-Lucien-Alex/assets/128807685/e1770f45-89d8-4739-aa21-c200938ef81d">














# Custom commands

<aside>
💡 **Command Processing**: As a back-end developer, I want to process commands directed at my bot by using string matching or a command prefix to distinguish between general messages and commands meant for the bot.

</aside>

- [x] 1. **Command Prefix Setting**: As a developer, I want to set a command prefix for my bot, so it can recognise when a message is a command. For instance, using "!" before a command (like **`!help`**).
- [x] 2. **Help Command**: As a developer, I want to implement a **`help`** command, so that when a user types **`!help`**, the bot will send a message listing all available commands and their descriptions.
- [x] 3. **Greetings Command**: As a developer, I want to create a **`greet`** command, so that when a user types **`!greet`**, the bot will respond with a personalised greeting message, like "Hello, [username]!"
- [x] 4. **Random Joke Command**: As a developer, I want to add a **`joke`** command, so that when a user types **`!joke`**, the bot will respond with a random joke.
- [x] 5. **Echo Command**: As a developer, I want to implement an **`echo`** command, so that when a user types **`!echo [message]`**, the bot will repeat the message back to them.
- [x] 6. **Command Logging**: As a developer, I want the bot to log the use of commands, so I can

---

- [ ] 1. **Weather Information Command**: As a developer, I want to implement a **`weather`** command, so users can type **`!weather [city name]`** to get the current weather information for a specified city. This will involve integrating an external weather API.
- [x] 2. **Poll Creation Command**: As a developer, I want to create a **`poll`** command, so that users can create interactive polls in the chat by typing **`!poll [question] [option1] [option2] ...`**. The bot should be able to tally votes and display results.
- [ ] 3. **Music Play Command**: As a developer, I want to implement a **`play`** command for music, so that users can play music in a voice channel by typing **`!play [song name or URL]`**. This requires handling audio streams and interfacing with Discord's voice channels.

---

- - [x] **Error Handling**: As a beginner, I want to implement error handling in my bot interactions using **`try...catch`** within my **`async`** functions to manage exceptions and provide error messages if something goes wrong.


# Handling mentions and DM Functionalities

*Try to implement **`some`** of the following user stories, you won’t have time to complete them all!*

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



# Use of OpenAI part of the bot

When starting a conversation the bot will try to guess the name of the user who invoqued it by their Discord username. If the real name is not present on the Discord user it will just ommit it.

