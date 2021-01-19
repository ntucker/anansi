import React from 'react';
import { useResource, useSubscription } from 'rest-hooks';
import { Link } from 'react-router-dom';
import { List, Avatar } from 'antd';
import moment from 'moment';
import LinkPagination from 'navigation/LinkPagination';
import IssueResource from 'github/IssueResource';

type Props = Pick<IssueResource, 'repositoryUrl'> &
  (
    | {
        page: number;
      }
    | {
        state: IssueResource['state'];
      }
  );

export default function IssueList(props: Props) {
  const params = {
    'repositoryUrl':'https://api.github.com/repos/coinbase/rest-hooks',
    state: 'open' as const
  };
  const { results: issues, link } = useResource(IssueResource.list(), params);
  //useSubscription(IssueResource.list(), params);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={issues}
        renderItem={(issue) => <IssueListItem key={issue.pk()} issue={issue} />}
      />
      <div className="center">
        <LinkPagination link={link} />
      </div>
    </>
  );
}

function IssueListItem({ issue }: { issue: IssueResource }) {
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
            <a href={issue.user.htmlUrl} target="_blank" rel="noreferrer noopener">
              {issue.user.login}
            </a>
          </>
        }
      />
    </List.Item>
  );
}
