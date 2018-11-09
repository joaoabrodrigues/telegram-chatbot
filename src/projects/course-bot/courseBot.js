const env = require('../../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

const bot = new Telegraf(env.token)

const optionsKeyboard = Markup.keyboard([
    ['O que são bots?', 'O que verei no curso?'],
    ['Posso mesmo automatizar tarefas?'],
    ['Como comprar o curso?']
]).resize().extra()

const buttons = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n')
], {columns: 2}))

const localization = Markup.keyboard([
    Markup.locationRequestButton('Clique aqui para enviar sua localização')
]).resize().oneTime().extra()

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`*Olá ${name}!* Eu eu sou o ChatBot do curso`)
    await ctx.replyWithPhoto('https://www.pdp.com/media/catalog/product/cache/1/image/c96a280f94e22e3ee3823dd0a1a87606/s/m/small_megaman_perspective_on_2.png')
    await ctx.replyWithMarkdown('_Posso te ajudar em algo?_', optionsKeyboard)
})

bot.hears('O que são bots?', ctx => {
    ctx.replyWithMarkdown('Bot, diminutivo de robot, também conhecido como Internet bot ou web robot, é uma aplicação de software concebido para simular ações humanas repetidas vezes de maneira padrão, da mesma forma como faria um robô.\n\n_Algo mais?_', optionsKeyboard)
})

bot.hears('O que verei no curso?', async ctx => {
    await ctx.replyWithMarkdown('No curso, também vamos criar *3 projetos*:')
    await ctx.reply('1. Um bot que vai gerenciar sua lista de compras')
    await ctx.reply('2. Um bot que vai te permitir cadastrar seus eventos')
    await ctx.reply('3. E você verá como eu fui feito, isso mesmo, você poderá fazer uma cópia de mim')
    await ctx.replyWithMarkdown('\n\n_Algo mais?_', optionsKeyboard)
})

bot.hears('Posso mesmo automatizar tarefas?', ctx => {
    ctx.replyWithMarkdown('Claro que sim, o bot servirá...\nQuer uma prova?', buttons)
})

bot.hears('Como comprar o curso?', ctx => {
    ctx.replyWithMarkdown('Acessando o link na [Udemy](https://www.udemy.com/chatbot-para-telegram-com-node)', optionsKeyboard)
})

bot.action('n', ctx => {
    ctx.reply('Ok, não precisa ser grosso :(', optionsKeyboard)
})

bot.action('s', async ctx => {
    ctx.reply('Que legal, tente me enviar a sua localização, ou escreva uma mensagem qualquer...', localization)
})

bot.on('text', async ctx => {
    let msg = ctx.message.text
    msg = msg.split('').reverse().join('')
    await ctx.reply(`A sua mensagem ao contrário é: ${msg}`)
    await ctx.reply(`Isso mostra que consigo ler o que você escreve e processar sua mensagem`, optionsKeyboard)
})

bot.on('location', async ctx => {
    try {
        const url = 'http://api.openweathermap.org/data/2.5/weather'
        const { latitude: lat, longitude: lon } = ctx.message.location
        const res = await axios.get(`${url}?lat=${lat}&lon=${lon}&APPID=106f39bd20f0b47178c06a5abad5642b&units=metric`)
        await ctx.reply(`Hum... Você está em ${res.data.name}`)
        await ctx.reply(`A temperatura por aí está em ${res.data.main.temp}°C`, optionsKeyboard)
    } catch(e) {
        await ctx.reply(`Estou com problemas para obter as informações de temperatura, você está no planeta terra? :P`, optionsKeyboard)
    }
})

bot.hears(/mensagem qualquer/i, async ctx => {
    await ctx.reply('Essa piada é velha, tenta outra...', optionsKeyboard)
})

bot.startPolling()