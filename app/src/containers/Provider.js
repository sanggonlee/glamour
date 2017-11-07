import { filter } from 'lodash/fp';

import { inject } from '../lib/di';
import { observe } from '../lib/pubsub';
import * as file from '../lib/file';

import Renderer from '../services/Renderer';
import Router from '../services/Router';

const layoutFile = 'layout.xml';

@inject(Renderer, Router)
@observe('router')
export default class Provider {
  constructor() {
    file.loadXML(layoutFile)
      .then(xml => {
        this.renderer.buildTree(xml);
        this.renderer.render();
      });

    this.subscribe('router');

    this._configureRouter();
  }

  storeUpdated(topic, store) {
    if (topic === 'router') {
      const { currentURL } = store;
      const routePath = filter(
        p => p !== ''
      )(currentURL.split('/'));

      this.renderer.render(routePath);
    }
  }

  _configureRouter() {
    this.router
      .route('profile', '/profile')
      .route('random', '/random');
  }

}