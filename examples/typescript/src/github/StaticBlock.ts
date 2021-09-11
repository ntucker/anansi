import BaseResource from './BaseResource';

abstract class StaticResource extends BaseResource {
  static a: string;
  static urlRoot = '/2/';

  static {
    this.a = this.urlRoot;
  }
}

export default class MyResource extends StaticResource {
  readonly id: string = '';

  static urlRoot = '/rootof/static/';

  pk() {
    return this.id;
  }
}
