import { map } from 'lodash/fp';

import fakePosts from '../../fake/posts';
import { inject } from '../lib/di';

import Api from '../services/Api';

import PostCard from '../components/PostCard';

@inject(Api)
export default class Posts {
  constructor() {
    this.posts = fakePosts;
  }

  buildElement(postCards) {
    const element = document.createElement('div');
    element.classList.add('posts-container');
    if (postCards) {
      postCards.forEach(postCard => {
        element.appendChild(postCard);
      });
    }
    return element;
  }
}