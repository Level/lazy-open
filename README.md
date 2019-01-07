# level-lazy-open

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

Lazily open a leveldown compatible backend.

__NOTE:__ This doesn't work with levelup yet, we're working on it. In the meantime
this can only be useful to you if you're using leveldown directly.

[![NPM](https://nodei.co/npm/level-lazy-open.png)](https://nodei.co/npm/level-lazy-open/)

[![Travis](https://img.shields.io/travis/Level/lazy-open.svg?logo=travis&label=)](https://travis-ci.org/Level/lazy-open)
[![Coverage Status](https://coveralls.io/repos/github/Level/lazy-open/badge.svg)](https://coveralls.io/github/Level/lazy-open)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

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

Create a new [abstract-leveldown](https://github.com/Level/abstract-leveldown)
compatible db that calls `factory` to get a db whenever it hasn't yet and you
perform an operation against it.

## Contributing

[`Level/lazy-open`](https://github.com/Level/lazy-open) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level), [npm](https://www.npmjs.com/) packages and (soon) [our website](http://leveldb.org). 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2012-present [Contributors](CONTRIBUTORS.md).
