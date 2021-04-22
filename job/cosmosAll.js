const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('./config')
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

const run = async function(batchCallback) {
  const querySpec = {
      query: 'SELECT * from c '
  }
  const queryOptions  = {
      maxItemCount : 1000,
      maxDegreeOfParallelism: 5
  }
 const queryIterator = await container.items.query(querySpec,queryOptions)
 while (queryIterator.hasMoreResults()) {
      const r = await queryIterator.fetchNext()
      if ( (r.resources === undefined) || (r.resources.length === 0)) {
          break;
      }
      lastDate = r.resources[r.resources.length-1].eventTime 
      await batchCallback(r.resources)
  }
}

module.exports = run
