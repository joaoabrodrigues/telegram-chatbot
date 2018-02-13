const env = require('../../.env');
const Telegraf = require('telegraf')
const moment = require('moment')

const bot = new Telegraf(env.token)

bot.hears('pizza', ctx => ctx.reply('I want!'))
bot.hears(['eggplant', 'avocado'], ctx => ctx.reply('I don\'t want!'))
bot.hears('💩', ctx => ctx.reply('poop 💩'))
bot.hears(/burger/i, ctx => ctx.reply('I want!'))
bot.hears([/salad/i, /lettuce/i], ctx => ctx.reply('I don\'t want!'))
bot.hears(/(\d{2})\/(\d{2})\/(\d{4})/g, ctx => {
    // moment.locale('pt-BR')
    console.log(ctx.match)
    const data = moment(ctx.match[0], 'DD/MM/YYYY')
    ctx.reply(`${ctx.match[0]} is a ${data.format('dddd')}`)
})

bot.startPolling()