import { Entity } from '@data-client/rest';

abstract class StaticEntity extends Entity {
  static a: string;
  static urlRoot = '/2/';

  static {
    this.a = this.urlRoot;
  }
}

export default class MyEntity extends StaticEntity {
  readonly id: string = '';

  static urlRoot = '/rootof/static/';

  pk() {
    return this.id;
  }
}
