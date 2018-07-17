
# level-lazy-open

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

Lazily open a leveldown compatible backend.

__NOTE:__ This doesn't work with levelup yet, we're working on it. In the meantime
this can only be useful to you if you're using leveldown directly.

[![NPM](https://nodei.co/npm/level-lazy-open.png)](https://nodei.co/npm/level-lazy-open/)

[![Build Status](https://secure.travis-ci.org/Level/lazy-open.png)](http://travis-ci.org/Level/lazy-open)
[![Coverage Status](https://coveralls.io/repos/github/Level/lazy-open/badge.svg)](https://coveralls.io/github/Level/lazy-open)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Greenkeeper badge](https://badges.greenkeeper.io/Level/lazy-open.svg)](https://greenkeeper.io/)

## Example

```js
var lazy = require('level-lazy-open');
var down = require('leveldown');

// a function that returns an open backend
function factory(cb){
  var db = down('./db');
  db.open(function(err){
    cb(err, db);
  });
}

var db = lazy(factory);

// db is closed and won't be opened, unless
// you do something with it:

db.put('foo', 'bar', function(err){
  // db is open now

  // you can manually close the db again:
  db.close(function(err){
    // the end
  });
});
// db is opening now
```

## Installation

```bash
$ npm install level-lazy-open
```

## API

### lazy(factory)

Create a new [abstract-leveldown](https://github.com/level/abstract-leveldown)
compatible db that calls `factory` to get a db whenever it hasn't yet and you
perform an operation against it.

<a name="contributing"></a>
## Contributing

**level-lazy-open** is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [contribution guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

<a name="licence"></a>
## Licence &amp; Copyright

Copyright (c) 2012-2017 **level-lazy-open** [contributors](https://github.com/level/community#contributors).

**level-lazy-open** is licensed under the MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
