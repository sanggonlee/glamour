export default class Browse {
  buildElement(searchBar, posts, profile) {
    const element = document.createElement('div');
    element.classList = 'main-browse';
    
    if (searchBar) element.appendChild(searchBar);
    if (posts) element.appendChild(posts);
    if (profile) element.appendChild(profile);
    
    return element;
  }
}