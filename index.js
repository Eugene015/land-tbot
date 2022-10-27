const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const bot = new TelegramApi("1384303788:AAE1gL3Yr5krwRr_dE_R6rIYAE3b-nSCVwI", {
  polling: true,
});

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Guess my number from 0 to 9?`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Guess!`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Starting message" },
    { command: "/info", description: "User info" },
    { command: "/game", description: "Game guess number" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/642/d5c/642d5c05-6153-3fb0-9201-23cbe0f1cc76/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Zemlevporyadnik company. Welcome to our telegram bot!`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name is ${msg.from.first_name}  ${msg.from.username}!`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `I do not understand you, try again!`);
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congrats! Correct number is ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Pity(! That is wrong number, correct is ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
