**Start the App Locally**
=========

```sh
$ npm install
$ gulp
```

**Development Guides**
==========
### Setting Up UI Hierarchy
The `layout.xml` file in the root directory configures the components hierarchy.
```xml
<Root>
    <LoginPage>
        <LoginForm></LoginForm>
    </LoginPage>
</Root>
```
Set the `route` attribute to render the corresponding component only in that route.
```xml
<Root>
    <LoginPage route="login">
        <LoginForm></LoginForm>
    </LoginPage>
</Root>
```
Use `<Repeat>` element to repeat certain elements, and pass the data to iterate in its parent element. In the example below, `users` field should be present in the `UsersList` instance as an array. Each item in the `users` will be passed to each `UserInfo`'s constructor.
```xml
<Root>
    <UsersList repeat="users">
        <Repeat>
            <UserInfo></UserInfo>
        </Repeat>
    </UsersList>
</Root>
```
### Build DOM Elements
To build a component's DOM element, return the element in each component's `buildElement` method. Suppose our `layout.xml` file looks like this:
```xml
<Root>
    <LoginPage>
        <LoginForm></LoginForm>
    </LoginPage>
    <ProfilePage repeat="friends">
        <Repeat>
            <FriendInfo></FriendInfo>
        </Repeat>
    </ProfilePage>
</Root>
```
Then in the `Root` class's `buildElement` method you'll be passed the elements built for `LoginPage` and `ProfilePage`:
```js
class Root {
    ...
    buildElement(loginPage, profilePage) {
        const element = document.createElement('div');
        element.appendChild(loginPage);
        element.appendChild(profilePage);
        return element;
    }
    ...
}
```
For repeated components, they will be passed as an array:
```js
class ProfilePage
    ...
    buildElement(friendsInfoElements) {
        const element = document.createElement('div');
        friendsInfoElements.forEach(f => element.appendChild(f));
        return element;
    }
```
Note that a child element passed will be `null` if it's detached from the DOM (e.g. it's not in current route).

### Dependency Injection
Use `injectable` and `inject` in the `app/src/lib/di.js`.
So for dependency:
```js
import { injectable } from '../lib/di';
@injectable
class FooService {
    ...
}
```
For classes that dependencies are injected to:
```js
import { inject } from '../lib/di';
import FooService from '../services/Foo';
@inject(FooService)
class BarComponent {
    ...
}
```

### Pub-Sub
Use `observe` from `app/src/lib/pubsub.js` to register the instance as an observer to the desired topics. The class will then be able to call `publish` and `subscribe` to the topics:
```js
import { observe } from  '../lib/pubsub';
@observe('topic1', 'topic2')
class FooComponent {
    constructor() {
        this.subscribe('topic1');   // start subscribing
    }
    somethingChanged() {
        this.publish('topic1', 'iAmKey', 'iAmValue');
    }
```
Each observer will be notified of the topic's store change via `storeUpdated` method:
```js
class FooComponent {
    storeUpdated(topic, store) {
        if (topic === 'topic1') {
            const newVal = store.iAmKey;
        }
    }
```