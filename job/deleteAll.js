const cosmos = require('./cosmosDelete')

// one line per JSON - not a big JSON array
const batchCallback = (operations, res) => {
  console.log("random deleted id ", operations[0].id )
  console.log("deleted", res.length)
  const errs = res.filter(r => r.statusCode !== 204)
  if (errs) console.log(errs)
}
cosmos(batchCallback)
