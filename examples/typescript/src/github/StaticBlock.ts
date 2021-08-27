// TODO: remove this lint disable once typescript-eslint/parser supports class static blocks
/* eslint-disable prettier/prettier */
import BaseResource from './BaseResource';

class StaticResource extends BaseResource {
  static a: string;
  static urlRoot = '/2/';
  static {
    this.a = this.urlRoot;
  }
}

export default class MyResource extends StaticResource {
  static urlRoot = '/rootof/static/';
}
