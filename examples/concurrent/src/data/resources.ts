import { Resource, SimpleRecord } from '@rest-hooks/rest';

export class PostResource extends Resource {
  readonly id: number | undefined = undefined;
  readonly userId: number | undefined = undefined;
  readonly title: string = '';
  readonly body: string = '';

  pk() {
    return this.id?.toString();
  }

  static urlRoot = 'https://jsonplaceholder.typicode.com/posts/';
}
export class CommentResource extends Resource {
  readonly postId: number = 0;
  readonly id: number | undefined = undefined;
  readonly name: string = '';
  readonly email: string = '';
  readonly body: string = '';

  pk() {
    return this.id?.toString();
  }

  static urlRoot = 'https://jsonplaceholder.typicode.com/comments/';
}

export class Address extends SimpleRecord {
  readonly street: string = '';
  readonly suite: string = '';
  readonly city: string = '';
  readonly zipcode: string = '';
  readonly geo: {
    readonly lat: string;
    readonly lng: string;
  } | null = null;
}
export class UserResource extends Resource {
  readonly id: number = 0;
  readonly name: string = '';
  readonly username: string = '';
  readonly email: string = '';
  readonly phone: string = '';
  readonly website: string = '';
  readonly address: Address | null = null;

  static schema = {
    address: Address,
  };

  pk() {
    return this.id?.toString();
  }

  static urlRoot = 'https://jsonplaceholder.typicode.com/users/';

  get addressDisplay() {
    return `${this.address?.street} ${this.address?.city}`;
  }
}
