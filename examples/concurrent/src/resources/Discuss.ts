import PlaceholderBaseResource from './PlaceholderBaseResource';

export class PostResource extends PlaceholderBaseResource {
  readonly userId: number | undefined = undefined;
  readonly title: string = '';
  readonly body: string = '';

  static getEndpointExtra() {
    return { dataExpiryLength: 10000 };
  }

  static urlRoot = 'https://jsonplaceholder.typicode.com/posts/';
}

export class CommentResource extends PlaceholderBaseResource {
  readonly postId: number = 0;
  readonly name: string = '';
  readonly email: string = '';
  readonly body: string = '';

  static urlRoot = 'https://jsonplaceholder.typicode.com/comments/';

  get profileImage() {
    return `https://i.pravatar.cc/256?img=${(this.id + 15) % 70}`;
  }
}

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
export class UserResource extends PlaceholderBaseResource {
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

  static urlRoot = 'https://jsonplaceholder.typicode.com/users/';

  get addressDisplay() {
    return `${this.address?.street} ${this.address?.city}`;
  }

  get coverImage() {
    return `http://placekitten.com/800/200?image=${this.id}`;
  }

  get coverImageFallback() {
    return `http://placekitten.com/80/20?image=${this.id}`;
  }

  get coverBackgroundImage() {
    return `url('${this.coverImage}'), url('${this.coverImageFallback}')`;
  }

  get profileImage() {
    return `https://i.pravatar.cc/256?img=${this.id + 4}`;
  }
}
