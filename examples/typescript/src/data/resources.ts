import {
  placeholderResource,
  PlaceholderEntity,
} from './PlaceholderBaseResource';

export class Post extends PlaceholderEntity {
  readonly userId: number | undefined = undefined;
  readonly title: string = '';
  readonly body: string = '';
}
export const PostResource = placeholderResource({
  path: '/posts/:id',
  schema: Post,
});

export class Comment extends PlaceholderEntity {
  readonly postId: number = 0;
  readonly name: string = '';
  readonly email: string = '';
  readonly body: string = '';

  get profileImage() {
    return `https://i.pravatar.cc/256?img=${(this.id + 15) % 70}`;
  }
}
export const CommentResource = placeholderResource({
  path: '/comments/:id',
  schema: Comment,
});

export class Address {
  readonly street: string = '';
  readonly suite: string = '';
  readonly city: string = '';
  readonly zipcode: string = '';
  readonly geo: {
    readonly lat: string;
    readonly lng: string;
  } | null = null;
}
export class Company {
  readonly name: string = '';
  readonly catchPhrase: string = '';
  readonly bs: string = '';
}
export class User extends PlaceholderEntity {
  readonly name: string = '';
  readonly username: string = '';
  readonly email: string = '';
  readonly phone: string = '';
  readonly website: string = '';
  readonly address: Address = new Address();
  readonly company: Company = new Company();

  static schema = {
    //address: Address,
    //company: Company,
  };

  get addressDisplay() {
    return `${this.address?.street} ${this.address?.city}`;
  }

  get coverImage() {
    return `https://loremflickr.com/800/200/kitten,cat?lock=${this.id}`;
  }

  get coverImageFallback() {
    return `https://loremflickr.com/80/20/kitten,cat?lock=${this.id}`;
  }

  get coverBackgroundImage() {
    return `url('${this.coverImage}'), url('${this.coverImageFallback}')`;
  }

  get profileImage() {
    return `https://i.pravatar.cc/256?img=${this.id + 4}`;
  }
}
export const UserResource = placeholderResource({
  path: '/users/:id',
  schema: User,
});
