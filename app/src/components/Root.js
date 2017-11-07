import NavBar from './NavBar';
import Posts from '../containers/Posts';

export default class Root {

  buildElement(navBar, mainBrowse) {
    const element = document.createElement('div');
    element.id = 'root';

    if (navBar) element.appendChild(navBar);
    if (mainBrowse) element.appendChild(mainBrowse);

    return element;
  }
}