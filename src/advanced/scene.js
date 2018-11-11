const env = require('../../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { enter, leave } = Stage

const bot = new Telegraf(env.token)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`*Hello ${name}!* Welcome!`)
    await ctx.reply('Send /echo or /sum to start...')
})

const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply('Entering echo scene.'))
echoScene.leave(ctx => ctx.reply('Leaving echo scene.'))
echoScene.command('exit', leave())
echoScene.on('text', ctx => ctx.reply(ctx.message.text))
echoScene.on('message', ctx => ctx.reply('Only text messages, please'))

let sum = 0 
const sumScene = new Scene('sum')
sumScene.enter(ctx => ctx.reply('Entering sum scene.'))
sumScene.leave(ctx => ctx.reply('Leaving sum scene.'))
sumScene.use(async (ctx, next) => {
    await ctx.reply('You are in sum scene, send numbers to sum')
    await ctx.reply('Another commands: /zero /exit')
    next()
})

sumScene.command('zero', ctx => {
    sum = 0
    ctx.reply(`Value ${sum}`)
})

sumScene.command('exit', leave())

sumScene.hears(/(\d+)/, ctx => {
    sum += parseInt(ctx.match[1])
    ctx.reply(`Value ${sum}`)
})

sumScene.on('message', ctx => ctx.reply('Only numbers, please'))

const stage = new Stage([echoScene, sumScene])
bot.use(session())
bot.use(stage.middleware())
bot.command('sum', enter('sum'))
bot.command('echo', enter('echo'))
bot.on('message', ctx => ctx.reply('Only send /echo or /sum, please'))
bot.startPolling()