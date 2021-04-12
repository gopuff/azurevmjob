'use strict'
const AWS = require('aws-sdk');
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const config = require('./config')

const kinesis = new AWS.Kinesis({region : config.kinesis.region});
let total = 0 
const processBatch = async function (events, streamName) {
  let kinesisEvents = events.map((e) => {
    if (!e.data) e.data = {}
    let prefix = (String(e.data.user_id) || '').split('-')
    let uid = prefix.pop()
    const eventType = e.eventType || e.event_type || 'Metric'
    prefix = prefix.join('-')
    return {
      Data: JSON.stringify({
        event_time: moment.utc(e.eventTime || new Date()).format('YYYY-MM-DD HH:mm:ss.SSS-00'),
        id: e.id || uuidv4(),
        event_type: eventType,
        source: e.source,
        data: JSON.stringify(e.data).replace(/\\/g, '\\\\'),
        action: e.data.action || e.action,
        user_id: parseInt(uid) || null,
        prefix,
        order_id: parseInt(e.data.order_id) || null,
        delivery_id: parseInt(e.data.delivery_id || (e.data.order || {}).delivery_id) || null
      }),
      PartitionKey: uuidv4()
    }
  })
  return kinesis.putRecords({
    Records: kinesisEvents,
    StreamName: streamName
  }).promise()
    //.then(() => console.log(`Put ${kinesisEvents.length} record${kinesisEvents.length === 1 ? '' : 's'} successfully`))
    .then(() => {total += 1; console.log(total)})
}

// processBatch([{}], config.jobs[0].streamName)
module.exports = processBatch