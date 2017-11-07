/**
 *    injectable:
 * 
 *      Declares the class as an injectable class.
 *      Registers the class to the central dependency store.
 * 
 *      Usage: @injectable
 *             class Foo {
 *               ...
 *               useFooMethod() {
 *                 ...
 *               }
 *             }
 * 
 *    inject:
 *      
 *      Injects the dependencies to the target.
 *      Gets the dependency from the central store and attach to the target class.
 * 
 *      Usage: @inject('Foo')
 *             class Bar {
 *               ...
 *             }
 * 
 *             and then in your Bar class,
 * 
 *             this.foo.useFooMethod();
 */

import _ from 'lodash';

const getName = cls => _.toLower(cls.name);

const __DEPENDENCY_STORE__ = {};

function _register(dependency) {
  __DEPENDENCY_STORE__[getName(dependency)] = new dependency();
}

function _isRegistered(dependency) {
  return !_.isNil(__DEPENDENCY_STORE__[getName(dependency)]);
}

/**
 * Configures dependency.
 * @param {Class} dependency 
 */
export const injectable = dependency => {
  if (!_isRegistered(dependency)) {
    _register(dependency);
  }
  return dependency;
};

/**
 * Injects dependencies to the target.
 * @param {Class[]} dependencies 
 */
export const inject = (...dependencies) => target => {
  _.forEach(dependencies, dependency => {
    if (!_isRegistered(dependency)) {
      _register(dependency);
    }
    target.prototype[getName(dependency)] = __DEPENDENCY_STORE__[getName(dependency)];
  });
  return target;
}
