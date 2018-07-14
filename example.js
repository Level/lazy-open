var lazy = require('.')
var down = require('memdown')

// a function that returns an open backend
function factory (cb) {
  var db = down('./db')
  db.open(function (err) {
    cb(err, db)
  })
}

var db = lazy(factory)

// db is closed and won't be opened, unless
// you do something with it:

db.put('foo', 'bar', function (err) {
  if (err) throw err
  // db is open now

  // you can manually close the db again:
  db.close(function (err) {
    if (err) throw err
    // the end
  })
})
// db is opening now
