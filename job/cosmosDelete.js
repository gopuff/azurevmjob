const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('./config')
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1);
const run = async function(batchCallback) {
  const querySpec = {
      query: 'SELECT c.id, c.eventType from c where c.eventType="GoPuff.Mixcart.DeliveryMapInteraction" and c._ts <= @yesterday',
      "parameters": [
        { "name": "@yesterday", "value": yesterday.getTime() }
      ]
  }
  const queryOptions  = {
      maxItemCount : 100,
      maxDegreeOfParallelism: 5
  }
 const queryIterator = await container.items.query(querySpec,queryOptions)
 while (queryIterator.hasMoreResults()) {
      const r = await queryIterator.fetchNext()
      if ( (r.resources === undefined) || (r.resources.length === 0)) {
          break;
      }
      const operations = r.resources.map( d => {
        return {
          operationType: "Delete",
          partitionKey: "GoPuff.Mixcart.DeliveryMapInteraction",
          id: d.id
        }
      })
      const res = await container.items.bulk(operations, { continueOnError: true })
      await batchCallback(operations, res)
  }
}

module.exports = run
