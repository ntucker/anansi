import BaseResource from './BaseResource';

declare abstract class StaticResource extends BaseResource {
  static a: string;
  static urlRoot: string;
}

export default abstract class MyResource extends StaticResource {
  static urlRoot: string;
}
