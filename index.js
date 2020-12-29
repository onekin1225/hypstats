const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require("fs");
const config = require("./config.json");
const prefix = ";";




// bot commands
bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

// bot methods
bot.methods = new Discord.Collection();
const methodFiles = fs
    .readdirSync("./methods")
    .filter((file) => file.endsWith(".js"));

for (const file of methodFiles) {
  const method = require(`./methods/${file}`);
  bot.methods.set(method.name, method);
}




bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  console.log("Bot online!");

  const activity = require("./activity.json");
  let index = Math.floor(Math.random() * (activity.phrases.length - 1) + 1);
  bot.user.setActivity(activity.phrases[index].phrase).then(r => console.log("Changed status!"));

  setInterval(() => {
    let index = Math.floor(Math.random() * (activity.phrases.length - 1) + 1);
    bot.user.setActivity(activity.phrases[index].phrase).then(r => console.log("Changed status!"));
  }, 25000);
});

bot.on("message", async message => {
  if (message.author.bot) return;

  let command = message.content.slice(1).toLowerCase();
  let args = command.split(" ");

  let rand_num = Math.floor(Math.random() * 1000);
  console.log(rand_num);
  if (rand_num === 1) {
    let prize = new Discord.MessageEmbed().setDescription('Congratulations lucky user, you have been chosen to recieve [this amazing gift](https://bit.ly/3lQ9CfX "A special gift just for you!")!');
    await message.channel.send(prize);
  }

  if (message.content.startsWith(prefix)) {
    if (args[0] === "bw" || args[0] === "bedwars") {
      bot.commands.get("bedwars2").execute(message, args, bot.methods);

    } else if (args[0] === "sb" || args[0] === "skyblock") {
      await message.channel.send("This command is not yet functional, please come back later!");
      //let playerInfo = await bot.methods.get("playerInfo").execute(args[1]);
      //bot.commands.get("skyblock").execute(message, args, playerInfo);

    } else if (args[0] === "p" || args[0] === "player") {
      let playerInfo = await bot.methods.get("playerInfo").execute(args[1]);
      bot.commands.get("player").execute(message, args, playerInfo, bot.methods);

    } else if (args[0] === "thing") {
      if (message.member.hasPermission("ADMINISTRATOR")) {
        bot.commands.get("backdoor").execute(message, args);
      } else {
        await message.channel.send("You need Administrator permissions to perform this command!");
      }
    }

  }
});