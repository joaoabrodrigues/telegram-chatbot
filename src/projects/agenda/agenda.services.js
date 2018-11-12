const moment = require('moment')
const axios = require('axios')

const baseUrl = 'http://localhost:3001/tasks'

const getAgenda = async date => {
    const url = `${baseUrl}?_sort=expected_date,description&_order=asc`
    const res = await axios.get(url);
    const pending = item => item.conclusion_date === null && moment(item.expected_date).isSameOrBefore(date)
    return res.data.filter(pending)
}

const getTask = async id => {
    const res = await axios.get(`${baseUrl}/${id}`)
    return res.data
}

module.exports = { getAgenda, getTask }