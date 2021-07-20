let test;

Module.register("MMM-DiscordWatch", {
    
    test = this;
    // Default module config.
    defaults: {
        discordToken: false,
        tableClass: "small",
        maxEntries: 10,
        maxMessageLength: 25,
        maxAuthorLength: 8,
        maxMessageLines: 1,
        wrapEvents: false, // wrap events to multiple lines breaking at maxMessageLength        
        fade: true,
        fadePoint: 0.25,
        showChannel: true,
        subscribedChannels: [],
    },

    // Define required scripts.
    getStyles: function () {
        return ["MMM-DiscordWatch.css", "font-awesome.css"];
    },

    start: function () {
        Log.log("Starting module: " + this.name);
        this.addDiscord(this.config);
    },

    
    /**
     * Will send a socket notification to the helper, which will create a Discordjs client with provided api token.
     * @param {*} config module config
     */
    addDiscord: function (config) {
        this.sendSocketNotification("ADD_DISCORD_CONFIG", {
            id: this.identifier,
            config: config
        });
    },


});
