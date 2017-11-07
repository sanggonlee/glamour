/**
 *    observe:
 * 
 *      Declares a list of topics that the class is eligible to subscribe to.
 *      Use this as a decorator to register subscribe() and publish() functions.
 * 
 *      Usage: use as a class decorator
 *             @observe('topic')
 *             class Foo {
 *               ...
 *             }
 * 
 * 
 *    subscribe:
 * 
 *      Begin subscribing to the topic.
 * 
 *      Usage: this.subscribe('topic');
 * 
 * 
 *    publish:
 * 
 *      Publish store change to notify all observers.
 * 
 *      Usage: this.publish('topic', 'foo', 'bar');
 *      
 */

import _ from 'lodash';

/**
 * Global store.
 * Map of objects
 */
const __STORE__ = new Map();

/**
 * Observer instances.
 * Map of arrays
 */
const __OBSERVERS__ = new Map();


const _registerTopic = (topic) => {
  if (!__STORE__.get(topic)) {
    __STORE__.set(topic, {});
    __OBSERVERS__.set(topic, []);
  }
};

const _registerToObserverList = (topic, instance) => {
  let observers = __OBSERVERS__.get(topic);
  if (!observers) {
    observers = [];
  }
  observers.push(instance);
  __OBSERVERS__.set(topic, observers);
}

const _notifyObservers = topic => {
  const store = __STORE__.get(topic);
  const observers = __OBSERVERS__.get(topic);
  _.forEach(observers, observer => {
    if (_.isFunction(observer.storeUpdated)) {
      observer.storeUpdated(topic, store);
    }
  });
}

export const observe = (...topics) => target => {
  _.forEach(topics, topic => {
    _registerTopic(topic);

    target.prototype.subscribe = topic => {
      _registerToObserverList(topic, target.prototype);
    };
  });

  target.prototype.publish = (topic, key, value) => {
    if (!_.includes(topics, topic)) {
      console.error(`This target is not observing topic ${topic}!`);
      return;
    }

    const store = __STORE__.get(topic);
    store[key] = value;

    _notifyObservers(topic);
  };

  return target;
};

