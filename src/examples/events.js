const env = require('../../.env');
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const from = ctx.update.message.from
    if (from.id === env.myId) {
        ctx.reply(`Hello ${from.first_name}, welcome!`)
    } else {
        ctx.reply('I don\'t know you, go fuck yourself!')
    }
})

bot.on('text', ctx => {
     ctx.reply(`Received text: '${ctx.update.message.text}'`)
})

bot.on('location', ctx => {
    const location = ctx.update.message.location
    console.log(location)
    ctx.reply(`You are in:\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`)
})

bot.on('contact', ctx =>{
    const contact = ctx.update.message.contact
    console.log(contact)
    ctx.reply(`I will remember \n${contact.first_name}: ${contact.phone_number}`)
})

bot.on('voice', ctx => {
    const voice = ctx.update.message.voice
    console.log(voice)
    ctx.reply(`Received audio duration: ${voice.duration} seconds`)
})

bot.on('photo', ctx => {
    const photo = ctx.update.message.photo
    console.log(photo)
    photo.forEach((ph, index) => {
        ctx.reply(`Photo ${index} resolution: ${ph.width}x${ph.height}`)
    })
})

bot.on('sticker', ctx => {
    const sticker = ctx.update.message.sticker
    console.log(sticker)
    ctx.reply(`You just sent ${sticker.emoji} of set ${sticker.set_name}`)
})

bot.startPolling()