const config = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: process.env.COSMOS_DB,
  containerId: process.env.COSMOS_CONTAINER,
  kinesis: {
    region: 'us-east-1'
  },

  jobs:[{ startTime: '2021-04-11T10:00:00.000Z', endTime: '2021-04-11T11:00:00.000Z', streamName: 'events_stream' }, { startTime: '2021-04-02T11:00:00.000Z', endTime: '2021-04-02T12:00:00.000Z', streamName: 'events_stream' }]

}

module.exports = config