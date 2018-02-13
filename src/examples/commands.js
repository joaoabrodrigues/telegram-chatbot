const env = require('../../.env');
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const from = ctx.update.message.from.first_name
    ctx.reply(`Hello ${from.first_name}, welcome!\nIf you need, /help`)
})

bot.command('help', ctx => ctx.reply('/help: I\'ll show you the options'
    + '\n/help2: to test with hears'
    + '\n/op2: option'
    + '\n/op3: another option'
))

bot.hears('/help2', ctx => ctx.reply('I can capture commands with hears, but it\'s better use /help'))

bot.hears(/\/op\d+/i, ctx => ctx.reply('Default answer for /op'))

bot.startPolling()