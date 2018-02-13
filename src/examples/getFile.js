const env = require('../../.env');
const Telegraf = require('telegraf')
const schedule = require('node-schedule')
const axios = require('axios');

const bot = new Telegraf(env.token)

bot.start(async (ctx, next) => {
    const from = ctx.update.message.from
    await ctx.reply(`Hello ${from.first_name}, welcome!`)
})

bot.on('voice', async ctx => {
    const id = ctx.update.message.voice.file_id

    await axios.get(`${env.apiUrl}/getFile?file_id=${id}`).then(resp => {
        ctx.replyWithVoice({ url: `${env.apiFileUrl}/${resp.data.result.file_path}` })
    })
})

bot.on('photo', async ctx =>{
    const id = ctx.update.message.photo[0].file_id

    await axios.get(`${env.apiUrl}/getFile?file_id=${id}`).then(resp => {
        ctx.replyWithPhoto({ url: `${env.apiFileUrl}/${resp.data.result.file_path}`})
    })
})

bot.startPolling()