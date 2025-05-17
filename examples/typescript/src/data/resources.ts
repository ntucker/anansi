import {
  placeholderResource,
  PlaceholderEntity,
} from './PlaceholderBaseResource';

export class Post extends PlaceholderEntity {
  userId = undefined;
  title = '';
  body = '';
}
export const PostResource = placeholderResource({
  path: '/posts/:id',
  schema: Post,
});

export class Comment extends PlaceholderEntity {
  postId = 0;
  name = '';
  email = '';
  body = '';

  get profileImage() {
    return `https://i.pravatar.cc/256?img=${(this.id + 15) % 70}`;
  }
}
export const CommentResource = placeholderResource({
  path: '/comments/:id',
  schema: Comment,
});

export class Address {
  street = '';
  suite = '';
  city = '';
  zipcode = '';
  geo: {
    readonly lat: string;
    readonly lng: string;
  } | null = null;
}
export class Company {
  name = '';
  catchPhrase = '';
  bs = '';
}
export class User extends PlaceholderEntity {
  name = '';
  username = '';
  email = '';
  phone = '';
  website: string = '';
  address: Address = new Address();
  company: Company = new Company();

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
