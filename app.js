const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client();
const MeCab = require("mecab-async");
const mecab = new MeCab();
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
let preText = "『OVER』～そして物語は加速する～";

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
    client.ws.on('INTERACTION_CREATE', async interaction => {
        //if (!interaction.isCommand()) return;
        if (interaction.data.name.toLowerCase() === 'again-accelerated') {
            const result = await run(preText);
            if (!result) return;
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: result
                    }
                }
            });
        }

    });
});

const run = async (text) => {
    const result = await mecab.parseSync(text);
    const kasoku = shuffle(Array.from(new Set(result.filter(term => term[1] === "名詞" && term[2] === "サ変接続"))));
    const noun = shuffle(Array.from(new Set(result.filter(term => term[1] === "名詞" && term[2] !== "サ変接続"))));
    if (!(kasoku.length >= 1 && noun.length >= 2)) return false;
    preText = text;
    return `『${noun[0][0]}』～そして${noun[1][0]}は${kasoku[0][0]}する～`;
}

client.on('message', async (msg) => {
    if (msg.author.id === client.user.id) return;
    const result = await run(msg.content);
    if (!result) return;
    msg.lineReply(result);
});



client.login(config.token);