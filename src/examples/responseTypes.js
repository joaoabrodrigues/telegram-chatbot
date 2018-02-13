const env = require('../../.env');
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(async ctx => {
    const from = ctx.update.message.from
    await ctx.reply(`Hello ${from.first_name}, welcome! 😎`)
    await ctx.replyWithHTML(`Highligthing <b>HTML</b> message \nof <i> different </i> <code>ways </code> \n<a href="http://www.google.com">Google</a>`)
    await ctx.replyWithMarkdown(`Highlighting *Markdown* message \n _of_ \`different\` \`\`\` ways \`\`\` \n[Google](http://www.google.com)`)
    await ctx.replyWithPhoto({source: `${__dirname}/img/octocat.png`})
    await ctx.replyWithPhoto('https://octodex.github.com/images/Professortocat_v2.png', { caption: 'Professoroctocat!' })
    await ctx.replyWithPhoto({ url: 'http://pluspng.com/img-png/github-octocat-logo-png-and-github-master-could-be-this-896.jpg' }, { caption: 'Master octocat!' })
    await ctx.replyWithLocation(-25.9773008, -50.1303068)
    await ctx.replyWithVideo('https://goo.gl/gSUq1p')
})

bot.startPolling()