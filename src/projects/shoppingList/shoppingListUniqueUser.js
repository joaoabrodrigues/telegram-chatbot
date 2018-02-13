const env = require('../../../.env');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')

const bot = new Telegraf(env.token)

const generateButtons = list => Extra.markup(
    Markup.inlineKeyboard(
        list.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    )
)

bot.use(session())

const verifyUser = (ctx, next) => {
    const sameMsgId = ctx.update.message && ctx.update.message.from.id === env.myId
    const sameCallbackId = ctx.update.callback_query && ctx.update.callback_query.from.id === env.myId
    if (sameMsgId || sameCallbackId) {
        next()
    } else {
        ctx.reply('I don\'t know you, go fuck yourself!')
    }
}

const processing = ({ reply }, next) => reply('processing...').then(() => next())

bot.start(verifyUser, async ctx => {
    const from = ctx.update.message.from
    await ctx.reply(`Hello ${from.first_name}, welcome! 😎`)
    await ctx.reply('Tell me what do you want to buy...')
    ctx.session.list = []
})

bot.on('text', verifyUser, processing, ctx => {
    const item = ctx.update.message.text
    ctx.session.list.push(item)
    ctx.reply(`${item} added!`, generateButtons(ctx.session.list))
})

bot.action(/delete (.+)/, verifyUser, ctx => {
    ctx.session.list = ctx.session.list.filter(item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deleted!`, generateButtons(ctx.session.list))
})

bot.startPolling()