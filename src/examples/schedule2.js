const env = require('../../.env');
const Telegraf = require('telegraf')
const schedule = require('node-schedule')
const puppeteer = require('puppeteer')

const bot = new Telegraf(env.token)

bot.start(async (ctx, next) => {
    const from = ctx.update.message.from
    if (from.id === env.myId) {
        await ctx.reply(`Hello ${from.first_name}!`)
        next()
    } else {
        await ctx.reply('I don\'t know you, go fuck yourself!')
    }
})

bot.use(async ctx => {
    var rule = new schedule.RecurrenceRule()
    rule.minute = [0,15,30,45]

    await schedule.scheduleJob(rule, () => {        
        (async () => {
            const browser = await puppeteer.launch() // { headless: false }
            const page = await browser.newPage()

            await page.goto('http://www.ssw.inf.br/2/rastreamento_dest_pf?')
            await page.type('#InputCPF', '123456')
            await page.click('[type="submit"]')
            await page.waitFor(2000)

            const data = await page.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('table tr td'))
                return tds.map(td => td.innerHTML)
            });

            await page.waitFor(2000)

            const message = data[1].replace(/<(?:.|\n)*?>/gm, '').replace('&nbsp;', '').replace('(PRM&nbsp;MGA)', '').replace(/  +/g, '')

            await ctx.reply(message)

            await browser.close()
        })()
    })
})

bot.startPolling()
