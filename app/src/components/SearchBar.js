export default class SearchBar {

  buildElement() {
    const element = document.createElement('div');
    element.classList.add('search-bar');

    // TODO: replace the below elements to actual components
    const loc = document.createElement('div');
    loc.classList.add('search-location');
    loc.textContent = 'Search Location';
    element.appendChild(loc);

    const platform = document.createElement('div');
    platform.classList.add('search-platform');
    platform.textContent = 'Search Platform';
    element.appendChild(platform);

    const post = document.createElement('div');
    post.classList.add('post');
    post.textContent = 'Post';
    element.appendChild(post);

    return element;
  }

}