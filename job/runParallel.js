const config = require('./config')
const kinesis = require('./kinesis')
const cosmos = require('./cosmos')

const jobs = config.jobs

async function loadWithAwait (numworkers) {
  let func = async () => {
    while (jobs.length) {
      console.log(jobs.length + " left")
      let job = jobs.shift()
      try {
        console.log("Staring ", job.start)
        // const batchCallback = (events) => kinesis(events, job.streamName)
        const batchCallback = (events) => console.log(events.length)
        await cosmos(job.startTime, job.endTime, batchCallback)
        console.log("Ending ", job.start)
      } catch (e) {
        console.log("failed", job)
        console.error(e)
      }
    }
  }
  for (var i = 0; i < numworkers; i++) func()
}

loadWithAwait(4).then(() => console.log("done"))
