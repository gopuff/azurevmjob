const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('./config')
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

const run = async function(startTime, endTime, batchCallback) {
  const querySpec = {
      query: 'SELECT * from c where c.eventTime >= @startTime and c.eventTime <= @endTime order by c.eventTime',
      parameters: [
        {"name": "@startTime", "value": startTime},
        {"name": "@endTime", "value": endTime},
    ]
  }
  console.log(querySpec)
  const queryOptions  = {
      maxItemCount : 150,
      maxDegreeOfParallelism: 5
  }
 const queryIterator = await container.items.query(querySpec,queryOptions)
 let lastDate
 let iterCount = 0
 while (queryIterator.hasMoreResults()) {
      const r = await queryIterator.fetchNext()
      if ( (r.resources === undefined) || (r.resources.length === 0)) {
          break;
      }
      lastDate = r.resources[r.resources.length-1].eventTime 
      await batchCallback(r.resources)
  }
  console.log("Last event: " + lastDate + 'for job' + startTime)
}

// run("2021-04-01T21:24:06.513", "2021-04-01T23:59:59.999", console.log)
//   .then(()=>console.log('done'))


module.exports = run

//kinesis has a 1MB payload max
function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
          switch(typeof obj) {
          case 'number':
              bytes += 8;
              break;
          case 'string':
              bytes += obj.length * 2;
              break;
          case 'boolean':
              bytes += 4;
              break;
          case 'object':
              var objClass = Object.prototype.toString.call(obj).slice(8, -1);
              if(objClass === 'Object' || objClass === 'Array') {
                  for(var key in obj) {
                      if(!obj.hasOwnProperty(key)) continue;
                      sizeOf(obj[key]);
                  }
              } else bytes += obj.toString().length * 2;
              break;
          }
      }
      return bytes;
  };

  function formatByteSize(bytes) {
      if(bytes < 1024) return bytes + " bytes";
      else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
      else return(bytes / 1073741824).toFixed(3) + " GiB";
  };

  return formatByteSize(sizeOf(obj));
}
