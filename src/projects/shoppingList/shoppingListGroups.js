const env = require('../../../.env');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let data = {}

const generateButtons = list => Extra.markup(
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

bot.use((ctx, next) => {
    const chatId = ctx.chat.id
    if (!data.hasOwnProperty(chatId)) {
        data[chatId] = []
    }
    ctx.items  = data[chatId]
    next()
})

bot.on('text', ctx => {
    let text = ctx.update.message.text
    if (text.startsWith('/')) {
        text = text.substring(1)
    }
    ctx.items.push(text)
    ctx.reply(`${text} added!`, generateButtons(ctx.items))
})

bot.action(/delete (.+)/, ctx => {
    const index = ctx.items.indexOf(ctx.match[1])
    if (index >= 0) {
        ctx.items.splice(index, 1)
    }
    ctx.reply(`${ctx.match[1]} deleted!`, generateButtons(ctx.items))
})

bot.startPolling()