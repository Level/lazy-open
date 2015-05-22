var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN;
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var inherits = require('inherits');
var debug = require('debug')('level-lazy-open');

module.exports = Lazy;
inherits(Lazy, AbstractLevelDOWN);

function Lazy(factory){
  assert(factory, 'factory required');

  AbstractLevelDOWN.call(this, '');
  this._factory = factory;
  this._db = null;
  this._opening = false;
  this._closing = false;
  this._events = new EventEmitter;
}

Lazy.prototype._open = function(opts, cb){
  throw new Error('can\'t manually open level-lazy-open');
};

Lazy.prototype._close = function(cb){
  var self = this;

  // closed
  if (!self._db && !self._opening) {
    debug('close(), but not open');
    throw new Error('not open');
  }

  // opening
  if (self._opening) {
    debug('close(), but opening');
    self._events.once('open', function(){
      self.close(cb);
    });
    return;
  }

  // open
  if (self._db && !self._opening) {
    debug('close()');
    self._closing = true;
    self._db.close(function(err){
      if (err) return cb(err);
      self.closing = false;
      self._db = false;
      cb();
      self._events.emit('closed');
    });
    return;
  }

  // closing
  if (self._closing) {
    debug('close(), but already closing');
    return self._events.once('closed', cb);
  }
};

'put get del batch'.split(' ').forEach(function(m){
  Lazy.prototype['_' + m] = function(){
    var self = this;
    if (self._db) return self._db[m].apply(self._db, arguments);

    var args = [].slice.call(arguments);

    if (self._opening) {
      self._events.once('open', function(){
        self._db[m].apply(self._db, args);
      });
      return;
    }

    self._opening = true;
    self._factory(function(db){
      self._db = db;
      self._opening = false;
      db[m].apply(db, args);
      self._events.emit('open');
    });
  };
});
