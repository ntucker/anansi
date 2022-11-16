import React from 'react';
import { useSuspense } from '@rest-hooks/react';
import { Link } from 'react-router-dom';
import { List, Avatar } from 'antd';
import moment from 'moment';

import { IssueResource, Issue } from '@standard-endpoint/github/Issue';
import LinkPagination from 'navigation/LinkPagination';

type Props = Pick<Issue, 'repositoryUrl'> &
  (
    | {
        page: number;
      }
    | {
        state: Issue['state'];
      }
  );

export default function IssueList(props: Props) {
  const params = {
    owner: 'coinbase',
    repo: 'rest-hooks',
    state: 'open' as const,
  };
  const { results: issues, link } = useSuspense(IssueResource.getList, params);
  //useSubscription(IssueResource.list(), params);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={issues}
        renderItem={issue => <IssueListItem key={issue.pk()} issue={issue} />}
      />
      <div className="center">
        <LinkPagination link={link} />
      </div>
    </>
  );
}

function IssueListItem({ issue }: { issue: Issue }) {
  const actions = [];
  if (issue.comments) {
    actions.push(
      <Link to={`/issue/${issue.number}`}>
        <span role="img" aria-label="Comments">
          🗨️
        </span>
        {issue.comments}
      </Link>,
    );
  }
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar src={issue.user.avatarUrl} />}
        title={
          <Link to={`/issue/${issue.number}`}>
            {issue.stateIcon} {issue.title}
          </Link>
        }
        description={
          <>
            <a href={issue.htmlUrl} target="_blank" rel="noreferrer noopener">
              #{issue.number}
            </a>{' '}
            opened {moment(issue.createdAt).fromNow()} by{' '}
            <a
              href={issue.user.htmlUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {issue.user.login}
            </a>
          </>
        }
      />
    </List.Item>
  );
}
