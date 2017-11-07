import { inject } from '../lib/di';

import Router from '../services/Router';

@inject(Router)
export default class NavBar {
  buildElement(profileLink) {
    const element = document.createElement('div');
    element.classList.add('nav-bar');

    const logo = document.createElement('div');
    logo.classList.add('logo');
    logo.textContent = 'Logo';
    element.appendChild(logo);

    const chat = document.createElement('div');
    chat.classList.add('chat');
    chat.textContent = 'Chat';
    element.appendChild(chat);

    if (profileLink) element.appendChild(profileLink);
    return element;
  }
}