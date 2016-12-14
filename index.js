var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN;
var DeferredIterator = require('deferred-leveldown').DeferredIterator;
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var inherits = require('inherits');
var debug = require('debug')('level-lazy-open');
var slice = [].slice;

module.exports = Lazy;
inherits(Lazy, AbstractLevelDOWN);

function Lazy(factory){
  assert(factory, 'factory required');
  if (!(this instanceof Lazy)) return new Lazy(factory)

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

Lazy.prototype._ensureOpen = function(cb){
  var self = this;
  if (self._db) return setImmediate(cb);

  if (self._opening) {
    self._events.once('open', function(){
      cb();
    });
    return;
  }

  self._opening = true;
  self._factory(function(err, db){
    self._opening = false;
    if (err) return cb(err);
    self._db = db;
    self._events.emit('open');
    cb();
  });
};

Lazy.prototype._close = function(cb){
  var self = this;

  if (!self._db && !self._opening) {
    debug('close(), but not open');
    throw new Error('not open');
  }

  if (self._opening) {
    debug('close(), but opening');
    self._events.once('open', function(){
      self.close(cb);
    });
    return;
  }

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

  if (self._closing) {
    debug('close(), but already closing');
    return self._events.once('closed', cb);
  }
};

'put get del batch approximateSize'.split(' ').forEach(function(m){
  Lazy.prototype['_' + m] = function(){
    var self = this;
    var args = slice.call(arguments);
    self._ensureOpen(function(){
      self._db[m].apply(self._db, args);
    });
  };
});

Lazy.prototype._iterator = function(opts){
  var self = this;
  var it = new DeferredIterator(opts);
  self._ensureOpen(function(){
    it.setDb(self._db);
  });
  return it;  
};

