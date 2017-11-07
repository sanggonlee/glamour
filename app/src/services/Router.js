import fp from 'lodash/fp';
import _ from 'lodash';

import { injectable } from '../lib/di';
import { observe } from '../lib/pubsub';

@injectable
@observe('router')
export default class Router {
  constructor() {
    this._routes = {};
    this._navigationStack = [];
    this._currentRoute = null;
  }

  route(key, url) {
    if (this._routes[key]) {
      console.error('Router got a duplicate route!');
      return;
    }

    this._routes[key] = url;
    return this;
  }

  navigate(key, params) {
    if (!this._routes[key]) {
      console.error(`Trying to navigate to unregistered route ${key}!`);
      return;
    }

    if (!_.isNil(this._currentRoute)) {
      this._navigationStack.push(
        _.cloneDeep(this._currentRoute));
    }
    this._currentRoute = { key, params };
    this._doNavigate(key, params);
  }

  back() {
    if (this._navigationStack.length === 0) {
      return;
    }

    const { key, params } = this._navigationStack.pop();
    this._currentRoute = { key, params };
    this._doNavigate(key, params);
  }

  _doNavigate(key, params) {
    const url = this._getConcreteURL(key, params);
    //window.history.pushState({}, null, url);
    window.location.href = '/#' + url;

    this.publish('router', 'currentURL', url);
  }

  _getConcreteURL(key, params) {
    let url = this._routes[key];

    _.forOwn(params, (val, prop) => {
      url = url.replace(`:${prop}`, val);
    });

    return url;
  }
}