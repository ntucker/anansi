import { Resource } from 'rest-hooks';

export class PostResource extends Resource {
  readonly id: number | null = null;
  readonly userId: number | null = null;
  readonly title: string = '';
  readonly body: string = '';

  pk() {
    return this.id;
  }
  static urlRoot = 'https://jsonplaceholder.typicode.com/posts/';
}
export class CommentResource extends Resource {
  readonly postId: number = 0;
  readonly id: number | undefined = undefined;
  readonly name: string = '';
  readonly email: string = '';
  readonly body: string = '';

  pk(): number | undefined {
    return this.id;
  }
  static urlRoot = 'https://jsonplaceholder.typicode.com/comments/';
}

export interface Address {
  readonly street: string;
  readonly suite: string;
  readonly city: string;
  readonly zipcode: string;
  readonly geo: {
    readonly lat: string;
    readonly lng: string;
  };
}
export class UserResource extends Resource {
  readonly id: number | null = null;
  readonly name: string = '';
  readonly username: string = '';
  readonly email: string = '';
  readonly phone: string = '';
  readonly website: string = '';
  readonly address: Address | null = null;

  pk() {
    return this.id;
  }
  static urlRoot = 'https://jsonplaceholder.typicode.com/users/';
}
