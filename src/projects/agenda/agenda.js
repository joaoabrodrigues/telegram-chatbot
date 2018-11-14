const env = require('../../../.env')

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const moment = require('moment')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const { getAgenda, 
        getTask,
        getTasks,
        getDone,
        addTask,
        finishTask,
        deleteTask,
        updateTaskDate,
        updateTaskNote
 } = require('./agenda.services')

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
<b>Expected:</b> ${formatDate(task.expected_date)}${conclusion}
<b>Note:</b> ${task.note || ''}`

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
    Markup.callbackButton('💬', `addNote ${taskId}`),
    Markup.callbackButton('✖️', `delete ${taskId}`)
], { columns: 4 }))

//--------------- COMMANDS ---------------

bot.command('day', async ctx => {
    const tasks = await getAgenda(moment())
    ctx.reply(`Here is your day agenda`, agendaButtons(tasks))
})

bot.command('tomorrow', async ctx => {
    const tasks = await getAgenda(moment().add({ day: 1 }))
    ctx.reply(`Here is your tasks until tomorrow`, agendaButtons(tasks))
})

bot.command('week', async ctx => {
    const tasks = await getAgenda(moment().add({ week: 1 }))
    ctx.reply(`Here is your tasks until next week`, agendaButtons(tasks))
})

bot.command('done', async ctx => {
    const tasks = await getDone()
    ctx.reply(`Here is your done tasks`, agendaButtons(tasks))
})

bot.command('tasks', async ctx => {
    const tasks = await getTasks()
    ctx.reply(`Here is your tasks with no date`, agendaButtons(tasks))
})

bot.action(/show (.+)/, async ctx => {
    await showTask(ctx, ctx.match[1])
})

bot.action(/finish (.+)/, async ctx => {
    await finishTask(ctx.match[1])
    await showTask(ctx, ctx.match[1])
    await ctx.reply('Task finished')
})

bot.action(/delete (.+)/, async ctx => {
    await deleteTask(ctx.match[1])
    await ctx.editMessageText('Task deleted')
})

const keyboardDate = Markup.keyboard([
    ['Today', 'Tomorrow'],
    ['1 Week', '1 Month']
]).resize().oneTime().extra()

let taskId = null

//----------- Date Scene

const dateScene = new Scene('date')

dateScene.enter(ctx => {
    taskId = ctx.match[1]
    ctx.reply('Would you like do set a date?', keyboardDate)
})

dateScene.leave(ctx => taskId = null)

dateScene.hears(/today/gi, async ctx => {
    const date = moment()
    handleDate(ctx, date)
})

dateScene.hears(/tomorrow/gi, async ctx => {
    const date = moment().add({ days: 1 })
    handleDate(ctx, date)
})

dateScene.hears(/^(\d+) day(s)?$/gi, async ctx => {
    const date = moment().add({ days: ctx.match[1] })
    handleDate(ctx, date)
})

dateScene.hears(/^(\d+) week(s)?$/gi, async ctx => {
    const date = moment().add({ weeks: ctx.match[1] })
    handleDate(ctx, date)
})

dateScene.hears(/^(\d+) month(s)?$/gi, async ctx => {
    const date = moment().add({ months: ctx.match[1] })
    handleDate(ctx, date)
})

dateScene.hears(/(\d{2}\/\d{2}\/\d{4})/g, async ctx => {
    const date = moment(ctx.match[1], 'DD-MM-YYYY')
    handleDate(ctx, date)
})

const handleDate = async (ctx, date) => {
    await updateTaskDate(taskId, date)
    await ctx.reply('Date updated!')
    await showTask(ctx, taskId, true)
    ctx.scene.leave()
}

dateScene.on('message', ctx => {
    ctx.reply('Accepted patterns\ndd/MM/yyyy\nX days\nX weeks\nX months')
})

//----------- Note Scene

const noteScene = new Scene('note')

noteScene.enter(ctx => {
    taskId = ctx.match[1]
    ctx.reply('Enter your note...')
})

noteScene.leave(ctx => taskId = null)

noteScene.on('text', async ctx => {
    const task = await getTask(taskId)
    const newNote = ctx.update.message.text
    const note = task.note ? task.note + '\n---\n' + newNote : newNote
    const res = await updateTaskNote(taskId, note)
    await ctx.reply('Note added!')
    await showTask(ctx, taskId, true)
    ctx.scene.leave()
})

noteScene.on('message', ctx => ctx.reply('Only text notes are allowed!'))

//---------------- SET STAGES

const stage = new Stage([dateScene, noteScene])
bot.use(session())
bot.use(stage.middleware())

bot.action(/setDate (.+)/, Stage.enter('date'))
bot.action(/addNote (.+)/, Stage.enter('note'))

//---------------- ADD TASK

bot.on('text', async ctx => {
    try {
        const task = await addTask(ctx.update.message.text)
        await showTask(ctx, task.id, true)
    } catch (err) {
        console.log(err)
    }
})

bot.startPolling()