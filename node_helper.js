const NodeHelper = require("node_helper");
const Log = require("../../js/logger");
const Discord = require('discord.js');

module.exports = NodeHelper.create({
    // Override start method.
    start: function () {
        Log.log("Starting node helper for: " + this.name);
        this.fetchers = [];
    },

    // Override socketNotificationReceived method.
    socketNotificationReceived: function (notification, payload) {
        console.log("notification received.");
        if (notification === "ADD_DISCORD_CONFIG") {
            this.createDiscordClient(payload.config, payload.id);
        }
    },

    createDiscordClient: function (config, identifier) {
        var self = this;
        console.log("connecting to discord.");
        // no token provided, we exit
        if (!config.discordToken) {
            self.sendSocketNotification("ERROR", { id: identifier, err: "Missing discord token." });
            return;
        }

        const client = new Discord.Client();

        client.on('ready', () => {
            console.debug(`Logged in as ${client.user.tag}!`);
            self.sendSocketNotification("CONNECTED", { id: identifier });
        });

        client.on('message', msg => {
            if (config.subscribedChannels.indexOf(msg.channel.id) > -1) {
                this.sendNotification("SHOW_ALERT", {type: "notification", title:msg.author.username, message: msg.content, timer: 1000});

                self.sendSocketNotification("NEW_MESSAGE", { id: identifier, text: msg.content, author: msg.author.username, channel: msg.channel.name, createdAt: msg.createdAt })
            }
        });

        client.login(config.discordToken).catch(err => {
            console.error(err);
            self.sendSocketNotification("ERROR", { id: identifier, err: err });
        });
    },

});
