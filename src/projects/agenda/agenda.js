const env = require('../../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')
const { getAgenda, getTask } = require('./agenda.services')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Welcome, ${name}!`)
})

const formatDate = date => date ? moment(date).format('DD/MM/YYYY') : ''

const showTask = async (ctx, taskId, newMsg = false) => {
    const task = await getTask(taskId)
    const conclusion = task.conclusion_date ? `\n<b>Finished in:</b> ${formatDate(task.conclusion_date)}` : ''
    const msg = `
        <b>${task.description}</b>
        <b>Expected:</b> ${formatDate(task.expected_date)}
        <b>Obs:</b> ${task.obs}
    `
    if (newMsg) {
        ctx.reply(msg, taskButtons(taskId))
    } else {
        ctx.editMessageText(msg, taskButtons(taskId))
    }
}

const agendaButtons = tasks => {
    const buttons = tasks.map(item => {
        const date = item.expected_date ? `${moment(item.expected_date).format('DD/MM/YYYY')}` : ''
        return [Markup.callbackButton(`${date} - ${item.description}`, `show ${item.id}`)]
    })
    return Extra.markup(Markup.inlineKeyboard(buttons, { columns: 1}))
}

const taskButtons = taskId => Extra.HTML().markup(Markup.inlineKeyboard([
    Markup.callbackButton('✔️', `finish ${taskId}`),
    Markup.callbackButton('📅', `setDate ${taskId}`),
    Markup.callbackButton('💬', `addObs ${taskId}`),
    Markup.callbackButton('✖️', `delete ${taskId}`)
], { columns: 4 }))

//--------------- COMMANDS ---------------

bot.command('day', async ctx => {
    const tasks = await getAgenda(moment())
    ctx.reply(`Here is your day agenda`, agendaButtons(tasks))
})

bot.action(/show (.+)/, async ctx => {
    await showTask(ctx, ctx.match[1])
})

bot.startPolling()