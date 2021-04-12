const config = require('./config')
const kinesis = require('./kinesis')
const cosmos = require('./cosmos')

console.log(process.env)
const job = config.jobs[0]
console.log(job)
const batchCallback = (events) => console.log(events.length, job.streamName)
// const batchCallback = (events) => kinesis(events, job.streamName)
cosmos(job.startTime, job.endTime, batchCallback)
