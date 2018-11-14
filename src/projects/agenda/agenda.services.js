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

const getTasks = async () => {
    const res = await axios.get(`${baseUrl}?_sort=description&_order=asc`)
    return res.data.filter(item => item.expected_date === null && item.conclusion_date === null)
}

const getDone = async () => {
    const res = await axios.get(`${baseUrl}?_sort=conclusion_date,description&_order=asc`)
    return res.data.filter(item => item.conclusion_date !== null)
}

const addTask = async desc => {
    const res = await axios.post(`${baseUrl}`, { description: desc, conclusion_date: null, expected_date: null, note: null})
    return res.data
}

const finishTask = async id => {
    const task = await getTask(id)
    const res = await axios.put(`${baseUrl}/${id}`, { ...task, conclusion_date: moment().format('YYYY-MM-DD') })
    return res.data
}

const deleteTask = async id => {
    await axios.delete(`${baseUrl}/${id}`)
}

const updateTaskDate = async (id, date) => {
    const task = await getTask(id)
    const res = await axios.put(`${baseUrl}/${id}`, { ...task, expected_date: date.format('YYYY-MM-DD')})
    return res.data
}

const updateTaskNote = async (id, note) => {
    const task = await getTask(id)
    const res = await axios.put(`${baseUrl}/${id}`, { ...task, note: note})
    return res.data
}

module.exports = { 
    getAgenda, 
    getTask,
    getTasks,
    getDone,
    addTask,
    finishTask,
    deleteTask,
    updateTaskDate,
    updateTaskNote
 }