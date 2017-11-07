import { filter, flow, map } from 'lodash/fp';

import { injectable } from '../lib/di';

import * as components from '../components/index';
import * as containers from '../containers/index';

// Node Types
const
  ELEMENT = 1,
  ATTRIBUTE = 2,
  TEXT = 3,
  CDATA_SECTION = 4,
  ENTITY_REFERENCE = 5,
  ENTITY = 6,
  PROCESSING_INSTRUCTION = 7,
  COMMENT = 8,
  DOCUMENT = 9,
  DOCUMENT_TYPE = 10,
  DOCUMENT_FRAGMENT = 11,
  NOTATION = 12;

const logError = (cls = 'Renderer', reason) =>
  console.error(`${cls} encountered a failure: ${reason}`);

const isElement = doc =>
  doc.nodeType === ELEMENT;

const isIterator = doc =>
  doc.nodeName === 'Repeat';

@injectable
export default class Renderer {

  tree = null;

  buildTree(xmlDoc) {
    const roots = xmlDoc.childNodes;

    if (roots.length > 1) {
      logError('Expected one root node while building tree');
      return;
    }

    if (roots[0].nodeType !== ELEMENT) {
      logError('Expected element node type as root node while building tree');
      return;
    }

    this.tree = new ComponentNode(roots[0]);
  }

  render(routePath) {
    //TODO: Need to replace only the updated components
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }

    if (routePath) {
      this.tree.scan(routePath);
    }

    const element = this.tree.render();
    document.body.insertBefore(element,
      document.body.firstChild);
  }
}


/**
 * Virtual DOM
 */
class ComponentNode {

  component = null;
  children = null;
  repeatOn = null;  // Repeat component
  route = null;     // Route path
  detached = false;

  constructor(doc, data, repeatables) {
    this._defineComponent(doc, data);
    this._addAttributes(doc);
    this._addChildren(doc, repeatables);
  }

  // Scan and mark nodes to detach as detached
  scan(routePath, detach) {
    if (detach) {
      this.detached = true;
      return;
    }
    this.detached = false;

    if (!this.children || !routePath.length) {
      return;
    }
    const childToRoute = this.children.find(c =>
      c.route === routePath[0]);

    if (childToRoute) {
      const route = routePath.shift();

      this.children.forEach(c => {
        if (c.route === route) {
          c.scan(routePath);
        } else {
          c.scan(null, true); // Mark as detached
        }
      });
    } else {
      this.children.forEach(c => c.scan(routePath));
    }
  }

  render() {
    if (this.detached) {
      return null;
    }
    // TODO: we should watch out for overflowing stack here
    return this.component.buildElement(
      ...map(c => c.render())(this.children));
  }

  _defineComponent(doc, data) {
    const name = doc.nodeName;

    if (name === 'Repeat') {
      this.component = new Iterator();
      return;
    }

    const component = components[name];
    const container = containers[name];

    if (component && container) {
      logError('ComponentNode', `Duplicate UI component name ${name}}! Make sure you don't have the same names in components and containers!`);
      throw { err: 'Class name clash' };
    }

    if (!component && !container) {
      logError('ComponentNode', `The UI component name ${name} does not exist!`)
      throw { err: 'Non-existent class name' };
    }

    this.component =
      (component && new component(data)) ||
      (container && new container(data));
  }

  _addAttributes(doc) {
    this.component.props = {};
    let attr;
    for (let i = 0; i < doc.attributes.length; ++i) {
      attr = doc.attributes.item(i);
      if (attr.name === 'repeat') {
        this.repeatOn = attr.value;
      } else if (attr.name === 'route') {
        this.route = attr.value;
      } else {
        this.component.props[attr.name] = attr.value;
      }
    }
  }

  _addChildren(doc, repeatables) {
    if (isIterator(doc) && repeatables) {
      const nodes = filter(isElement)(doc.childNodes);
      if (nodes.length > 1) {
        logError('ComponentNode', `Iterator element can have only one child to iterate`);
        return;
      }
      this.children = map(
        r => new ComponentNode(nodes[0], r)
      )(repeatables);
    } else {
      this.children = flow([
        filter(isElement),
        map(d => new ComponentNode(d, undefined, this._getItemsToRepeat(doc)))
      ])(doc.childNodes);
    }
  }

  _getItemsToRepeat(doc) {
    return this.repeatOn ? this.component[this.repeatOn] : undefined;
  }
}

/**
 * Component Iterator wrapper class
 */
class Iterator {
  buildElement(...iterees) {
    return iterees;
  }
}