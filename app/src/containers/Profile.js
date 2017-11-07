export default class Profile {
  buildElement() {
    const element = document.createElement('div');
    element.classList.add('profile-container');
    element.textContent = 'Profile Page';
    return element;
  }
}