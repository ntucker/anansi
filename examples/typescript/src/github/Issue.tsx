import { InfoCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { RestGenerics } from '@data-client/rest';
import React from 'react';

import { GithubEndpoint, GithubEntity, githubResource } from './Base';
import { Label } from './Label';
import { User } from './User';

const stateToIcon: Record<string, React.ReactNode> = {
  closed: <IssuesCloseOutlined />,
  open: <InfoCircleOutlined />,
};

@annotation
export class Issue extends GithubEntity {
  readonly number: number = 0;
  readonly repositoryUrl: string = '';
  readonly labelsUrl: string = '';
  readonly htmlUrl: string = '';
  readonly body: string = '';
  readonly title: string = '';
  readonly user: User = User.fromJS({});
  readonly state: 'open' | 'closed' = 'open';
  readonly locked: boolean = false;
  readonly comments: number = 0;
  readonly createdAt: Date = new Date(0);
  readonly updatedAt: Date = new Date(0);
  readonly closedAt: string | null = null;
  readonly labels: Label[] = [];
  readonly authorAssociation: string = 'NONE';
  readonly pullRequest: Record<string, any> | null = null;

  get stateIcon() {
    return stateToIcon[this.state];
  }

  get owner() {
    const pieces = this.repositoryUrl.split('/');
    return pieces[pieces.length - 2];
  }

  get repo() {
    const pieces = this.repositoryUrl.split('/');
    return pieces[pieces.length - 1];
  }

  static schema = {
    user: User,
    createdAt: Date,
    updatedAt: Date,
    labels: [Label],
  };

  pk() {
    return this.#privateMethodTest();
  }

  #privateMethodTest() {
    return [this.repositoryUrl, this.number].join(this.#pkJoinStr);
  }

  #pkJoinStr = ',';
}
// since we don't use for types - setting generics is not essential
class IssueEndpoint<O extends RestGenerics = any> extends GithubEndpoint<O> {
  pollFrequency = 60000;
}

export const IssueResource = githubResource({
  path: '/repos/:owner/:repo/issues/:number',
  schema: Issue,
  Endpoint: IssueEndpoint,
});
export default IssueResource;

function annotation(target: any) {
  target.annotated = true;
}
