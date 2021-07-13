const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));
const apiEndpoint = `https://discord.com/api/v8/applications/${config.botId}/commands`
const botToken = config.token;
const commandData = {
    "name": "again-accelerated",
    "description": "直前で加速に成功した文をもう一度加速させます",
    "options": []
}

async function main() {
    const fetch = require('node-fetch')

    const response = await fetch(apiEndpoint, {
        method: 'post',
        body: JSON.stringify(commandData),
        headers: {
            'Authorization': 'Bot ' + botToken,
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json()

    console.log(json)
}
main()