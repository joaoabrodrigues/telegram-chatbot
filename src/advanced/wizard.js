const env = require('../../.env')
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

let description = ''
let price = 0
let date = null

const confirm = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Yes', 's'),
    Markup.callbackButton('No', 'n')
]))

const priceHandler = new Composer()
priceHandler.hears(/(\d+)/, ctx => {
    price = ctx.match[1]
    ctx.reply('When do you will pay?')
    ctx.wizard.next()
})

priceHandler.use(ctx => ctx.reply('Only numbers are accepted...'))

const dataHandler = new Composer()
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
    date = ctx.match[1]
    ctx.reply(`Here's a summary of your purchase:
               Description: ${description}
               Price: ${price}
               Date: ${date}
               Ok?`, confirm)
    ctx.wizard.next()
})

dataHandler.use(ctx => ctx.reply('Send a date in format dd/MM/yyyy'))

const confirmHandler = new Composer()
confirmHandler.action('s', ctx => {
    ctx.reply('Purchase confirmed.')
    ctx.scene.leave()
})

confirmHandler.action('n', ctx => {
    ctx.reply('Purchase deleted.')
    ctx.scene.leave()
})

confirmHandler.use(ctx => ctx.reply('Only confirm your purchase', confirm))

const wizardPurchase = new WizardScene('purchase', 
    ctx => {
        ctx.reply('What do you brought?')
        ctx.wizard.next()
    },
    ctx => {
        description = ctx.update.message.text
        ctx.reply('How many did it cost?')
        ctx.wizard.next()
    },
    priceHandler,
    dataHandler,
    confirmHandler
)

const bot = new Telegraf(env.token)
const stage = new Stage([wizardPurchase], { default: 'purchase' })
bot.use(session())
bot.use(stage.middleware())

bot.startPolling()