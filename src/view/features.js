const collection = {
  connection: {
    id: 0,
    title: 'Connection',
    description: 'Connection'
  },
  subscriptions: {
    id: 1,
    title: 'Subscriptions',
    description: 'Subscriptions'
  },
  messages: {
    id: 2,
    title: 'Messages',
    description: 'Messages'
  },
  publish: {
    id: 3,
    title: 'Publish',
    description: 'Publish'
  }
};

module.exports = {
  list: collection,
  initial: collection.connection
};
