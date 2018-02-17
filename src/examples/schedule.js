const env = require('../../.env');
const Telegraf = require('telegraf')
const schedule = require('node-schedule')
const axios = require('axios');

const bot = new Telegraf(env.token)

bot.start(async (ctx, next) => {
    const from = ctx.update.message.from
    if (from.id === env.myId) {
        await ctx.reply(`Hello ${from.first_name}, I will send you the price of bitcoin!`)
        next()
    } else {
        await ctx.reply('I don\'t know you, go fuck yourself!')
    }
})

bot.use(async ctx => {
    var rule = new schedule.RecurrenceRule()
    rule.minute = [0,29]
    await schedule.scheduleJob(rule, () => {
        axios.get(env.apiBitcoin).then(resp => {
            ctx.reply(`BTC price: US$ ${resp.data[0].price_usd}`);
        })
    })
})

bot.startPolling()