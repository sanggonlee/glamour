export default class PostCard {
  constructor(post) {
    this.post = post;
  }

  buildElement() {
    const element = document.createElement('div');
    element.classList.add('post-card');

    element.appendChild(this._createGameName(this.post.gameName));
    element.appendChild(this._createPlatform(this.post.platform));
    element.appendChild(this._createDistance(this.post.distance));

    return element;
  }

  _createGameName(gameName) {
    const elem = document.createElement('div');
    elem.classList.add('game-name');
    elem.textContent = gameName;
    return elem;
  }

  _createPlatform(platform) {
    const elem = document.createElement('div');
    elem.classList.add('platform');
    elem.textContent = platform;
    return elem;
  }

  _createDistance(distance) {
    const elem = document.createElement('div');
    elem.classList.add('distance');
    elem.textContent = distance;
    return elem;
  }
}