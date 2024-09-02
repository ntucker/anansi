import { GithubEntity } from './Base';

export class Label extends GithubEntity {
  readonly nodeId: string = '';
  readonly name: string = '';
  readonly description: string = '';
  readonly color: string = '000000';
  readonly default: boolean = false;
}
