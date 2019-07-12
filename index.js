const bot = require('./src/bot');
const config = require('./src/config/config.json');

(async () => {
    await bot.init();
    await bot.login(config.credentials.username, config.credentials.password);
    await bot.searchAndLike(config.tags);
})()