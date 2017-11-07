import { inject } from '../lib/di';

import Router from '../services/Router';

@inject(Router)
export default class ProfileLink {
  buildElement() {
    const element = document.createElement('div');
    element.classList.add('profile');
    element.textContent = 'Profile';
    element.onclick = (e) => {
      this.router.navigate('profile');
    }
    return element;
  }
}