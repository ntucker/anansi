import { Resource } from '@rest-hooks/rest';

export class PostResource extends Resource {
  readonly id: number | undefined = undefined;
  readonly userId: number | undefined = undefined;
  readonly title: string = '';
  readonly body: string = '';

  pk() {
    return this.id?.toString();
  }

  static urlRoot = 'https://jsonplaceholder.typicode.com/posts/';

  static create<T extends typeof Resource>(this: T) {
    const listkey = this.list().key({});
    return super.create().extend({
      schema: this,
      update: (newResourceId: string) => ({
        [listkey]: (resourceIds: string[] = []) => [
          ...resourceIds,
          newResourceId,
        ],
      }),
    });
  }
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

const Address = {
  street: '',
  suite: '',
  city: '',
  zipcode: '',
  geo: null as {
    readonly lat: string;
    readonly lng: string;
  } | null,
};

export class UserResource extends Resource {
  readonly id: number = 0;
  readonly name: string = '';
  readonly username: string = '';
  readonly email: string = '';
  readonly phone: string = '';
  readonly website: string = '';
  readonly address: typeof Address | null = null;

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
