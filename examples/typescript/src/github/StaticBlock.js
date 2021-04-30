import BaseResource from './BaseResource'

class StaticResource extends BaseResource {
  static a
  static urlRoot = '/2/'
  static {
    this.a = this.urlRoot
  }

}

export default class MyResource extends StaticResource {
  static urlRoot = '/rootof/static/'
}
