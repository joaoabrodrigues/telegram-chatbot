const env = require('../../.env')
const schedule = require('node-schedule')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const telegram = new Telegram(env.token)
const bot = new Telegraf(env.token)

let count = 1

const buttons = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Cancel', 'cancel')
]))

const notify = () => {
    telegram.sendMessage(env.myId, `This is a event message [${count++}]`, buttons)
}

const notifying = new schedule.scheduleJob('*/5 * * * * *', notify)

bot.action('cancel', ctx =>  {
    notifying.cancel()
    ctx.reply('That\'s fine, I wont send messages anymore')
})

bot.startPolling()