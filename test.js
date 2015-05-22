var Lazy = require('./');
var test = require('tape');
var MemDOWN = require('memdown');

function factory(cb){
  setImmediate(function(){
    var db = MemDOWN();
    db.open(function(err){
      cb(err, db);
    });
  });
}

test('Lazy(factory)', function(t){
  t.throws(function(){
    new Lazy();
  }, /factory required/, 'factory required');

  var lazy = new Lazy(factory);
  t.ok(lazy, 'creates leveldown');

  t.end();
});

test('#open(opts, cb)', function(t){
  var lazy = new Lazy(factory);
  t.throws(function(){
    lazy.open({}, function(){});
  }, /can't manually open/, 'can\'t manually open');
  t.end();
});

test('#{put,get,del}()', function(t){
  t.test('integration', function(t){
    var lazy = new Lazy(factory);
    lazy.put('foo', 'bar', function(err){
      t.error(err);
      lazy.get('foo', function(err, val){
        t.error(err);
        t.equal(val.toString(), 'bar');
        lazy.del('foo', function(err){
          t.error(err);
          t.end();
        });
      });
    });
  });

  t.test('open guard', function(t){
    t.plan(6);
    var lazy = new Lazy(factory);
    lazy.put('foo', 'bar', function(err){
      t.error(err);
      lazy.get('foo', function(err, val){
        t.error(err);
        t.equal(val.toString(), 'bar');
      });
    });
    lazy.put('bar', 'baz', function(err){
      t.error(err);
      lazy.get('bar', function(err, val){
        t.error(err);
        t.equal(val.toString(), 'baz');
      });
    });
  });
});

test('#close(cb)', function(t){
  t.test('closed', function(t){
    var lazy = new Lazy(factory);
    t.throws(function(){
      lazy.close(function(){});
    }, /not open/, 'not open');
    t.end();
  });
  t.test('opening', function(t){
    t.plan(2);
    var lazy = new Lazy(factory);
    lazy.put('foo', 'bar', function(err){
      t.error(err);
    });
    lazy.close(function(err){
      t.error(err);
    });
  });
  t.test('open', function(t){
    var lazy = new Lazy(factory);
    lazy.put('foo', 'bar', function(err){
      t.error(err);
      lazy.close(function(err){
        t.error(err);
        t.end();
      });
    });
  });
  t.test('closing', function(t){
    t.plan(3);
    var lazy = new Lazy(factory);
    lazy.put('foo', 'bar', function(err){
      t.error(err);
      lazy.close(function(err){
        t.error(err);
      });
      lazy.close(function(err){
        t.error(err);
      });
    });
  });
});

test('#iterator(opts)', function(t){
  var lazy = new Lazy(factory);
  var it = lazy.iterator({});
  it.next(function(){
    t.equal(arguments.length, 0, 'ended');
    t.end();
  });
});

