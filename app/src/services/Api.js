import { injectable } from '../lib/di';

@injectable
export default class Api {
  foo() {
    return 'foo';
  }
}