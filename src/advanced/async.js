const env = require('../../.env')
const Telegram = require('telegraf/telegram')
const Markup = require('telegraf/markup')
const axios = require('axios')

const sendMessage = msg => {
    axios.get(`${env.apiUrl}/sendMessage?chat_id=${env.myId}&text=${encodeURI(msg)}`)
    .catch(e => console.log(e))
}

setInterval(() => {
    sendMessage('Sending async message')
}, 3000)

const keyboard = Markup.keyboard([
    ['Ok', 'Cancel']
]).resize().oneTime().extra()

const telegram = new Telegram(env.token)
telegram.sendMessage(env.myId, 'This is a message with a keyboard', keyboard)