const fs = require('fs/promises')
const cosmos = require('./cosmosAll')

// one line per JSON - not a big JSON array
const batchCallback = (items) => {
  rows = items.map(JSON.stringify).join('\n')
  return fs.appendFile('products.json', rows)
}
const sql = 'select * from c'
cosmos(undefined, undefined, batchCallback, sql)
