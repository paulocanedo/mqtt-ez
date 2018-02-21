let observer = (() => {
  let observers = new Map();

  let getHandlers = (what) => {
    let collection = observers.get(what);
    if(!collection) {
      collection = [];
      observers.set(what, collection);
    }
    return collection;
  };

  return {
    subscribe(what, callback) {
      let handlers = getHandlers(what);
      handlers.push(callback);
    },
    publish(what, args) {
      let handlers = getHandlers(what);
      for(let handler of handlers) {
        handler(args);
      }
    }
  };
})();

module.exports = observer;
