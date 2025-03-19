   // functions/bot.js

   const TeleBot = require('telebot');
   const fetch = require('node-fetch');

   const bot = new TeleBot({
     token: process.env.TELEGRAM_BOT_TOKEN,
   });

   bot.on('text', async (msg) => {
     const chatId = msg.chat.id;
     const text = msg.text.trim();

     if (text === "/start") {
       await bot.sendMessage(chatId, "Hello! I'm XIV AI. Choose model in /settings or send me a message. \n\n /help - Help with commands");
     } else if (text === "/help") {
       await bot.sendMessage(chatId, "Команда временно недоступна.");
     } else if (text === "/settings") {
       await bot.sendMessage(chatId, "Команда временно недоступна.");
     } else if (text === "/clear") {
       await bot.sendMessage(chatId, "Команда временно недоступна.");
     } else {
       try {
         const response = await fetch("https://nervous-nostalgic-apparel.glitch.me/messages", {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             messages: [
               { "role": "user", "content": text }
             ],
             model: "openai-large",
           })
         });

         const data = await response.json();
         await bot.sendMessage(chatId, data?.response || "Something went wrong.");
       } catch (error) {
         console.error("Error processing message:", error);
         await bot.sendMessage(chatId, "Произошла ошибка при обработке вашего запроса.");
       }
     }
   });

   exports.handler = async (event, context) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method Not Allowed' };
     }

     try {
       const update = JSON.parse(event.body);
       await bot.handleUpdate(update);
       return { statusCode: 200, body: 'OK' };
     } catch (error) {
       console.error("Error handling update:", error);
       return { statusCode: 500, body: 'Internal Server Error' };
     }
   };