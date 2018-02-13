const env = require('../../../.env');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let list = []

const generateButtons = () => Extra.markup(
    Markup.inlineKeyboard(
        list.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    )
)

bot.start(async ctx => {
    const from = ctx.update.message.from
    await ctx.reply(`Hello ${from.first_name}, welcome! 😎`)
    await ctx.reply('Tell me what do you want to buy...')
})

bot.on('text', ctx => {
    const item = ctx.update.message.text
    list.push(item)
    ctx.reply(`${item} added!`, generateButtons())
})

bot.action(/delete (.+)/, ctx => {
    list = list.filter(item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deleted!`, generateButtons())
})

bot.startPolling()