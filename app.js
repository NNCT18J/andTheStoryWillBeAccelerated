const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client();
const MeCab = require("mecab-async");
const mecab = new MeCab();
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (msg.author.id === client.user.id) return;
    const result = await mecab.parseSync(msg.content);
    const kasoku = shuffle(Array.from(new Set(result.filter(term => term[1] === "名詞" && term[2] === "サ変接続"))));
    const noun = shuffle(Array.from(new Set(result.filter(term => term[1] === "名詞" && term[2] !== "サ変接続"))));
    if (!(kasoku.length >= 1 && noun.length >= 2)) return;
    msg.lineReply(`『${noun[0][0]}』～そして${noun[1][0]}は${kasoku[0][0]}する～`)
});

client.login(config.token);