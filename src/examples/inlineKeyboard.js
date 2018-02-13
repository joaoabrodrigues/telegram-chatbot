const env = require('../../.env');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let count = 0

const buttons = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('+1', 'add 1'),
    Markup.callbackButton('+10', 'add 10'),
    Markup.callbackButton('+100', 'add 100'),
    Markup.callbackButton('-1', 'sub 1'),
    Markup.callbackButton('-10', 'sub 10'),
    Markup.callbackButton('-100', 'sub 100'),
    Markup.callbackButton('Reset 🔃', 'reset'),
    Markup.callbackButton('Result❗', 'result')
], { columns: 3 }))

bot.start(async ctx => {
    await ctx.reply(`Welcome, ${ctx.update.message.from.first_name}`)
    await ctx.reply(`The counting is in ${count}`, buttons)
})

bot.action(/add (\d+)/gi, ctx => {
    count += parseInt(ctx.match[1])
    ctx.reply(`The counting is in ${count}`, buttons)
})

bot.action(/sub (\d+)/gi, ctx => {
    count -= parseInt(ctx.match[1])
    ctx.reply(`The counting is in ${count}`, buttons)
})

bot.action('reset', ctx => {
    count = 0
    ctx.reply(`The counting is in ${count}`, buttons)
})

bot.action('result', ctx => {
    ctx.answerCbQuery(`The counting is in ${count}`)
})

bot.startPolling()