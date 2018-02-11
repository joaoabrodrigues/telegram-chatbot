const env = require('../.env');
const Telegraf = require('telegraf')
const schedule = require('node-schedule')
const request = require('request');

const bot = new Telegraf(env.token)

bot.start(async (ctx, next) => {
    const from = ctx.update.message.from
    if (from.id === env.myId) {
        ctx.reply(`Hello ${from.first_name}, I will send you the price of bitcoin!`)
    } else {
        ctx.reply('I don\'t know you, go fuck yourself!')
    }
    next()
})

bot.use(ctx => {
    var rule = new schedule.RecurrenceRule()
    rule.minute = 0
    schedule.scheduleJob(rule, () => {
        request.get(env.apiBitcoin, (err, resp, body) => {
            ctx.reply(`The current price of BTC is: ${JSON.parse(body)[0].price_usd}`);
        })
    })
})

bot.startPolling()