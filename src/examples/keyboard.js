const env = require('../../.env');
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

const foodKeyboard = Markup.keyboard([
    ['🐷 Pork','🐮 Beef','🐏 Lamb'],
    ['🐔 Chicken','🐣 Egg'],
    ['🐟 Fish','🐙 Sea food'],
    ['🍄 Vegan']
]).resize().extra()

bot.start(async ctx => {
    await ctx.reply(`Welcome, ${ctx.update.message.from.first_name}`)
    await ctx.reply('Which drink do you prefer?', Markup.keyboard(['Coke', 'Pepsi']).resize().oneTime().extra())
})

bot.hears(['Coke', 'Pepsi'], async ctx => {
    await ctx.reply(`Wow! I like ${ctx.match} too!`)
    await ctx.reply('Which food do you prefer?', foodKeyboard)
})

bot.hears('🐮 Beef', ctx => ctx.reply('Me too!'));
bot.hears('🍄 Vegan', ctx => ctx.reply('Congrats! But I still like meat'));
bot.on('text', ctx => ctx.reply('Nice!'));

bot.startPolling()