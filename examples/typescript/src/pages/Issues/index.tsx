import { useLive } from '@data-client/react';
import { IssueResource, Issue } from '@standard-endpoint/github/Issue';
import { List, Avatar } from 'antd';
import LinkPagination from 'navigation/LinkPagination';
import React from 'react';
import { Link } from 'react-router-dom';

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
    owner: 'data-client',
    repo: 'rest-hooks',
    state: 'open' as const,
  };
  const { results: issues, link } = useLive(IssueResource.getList, params);

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
            opened {fromNow(issue.createdAt.getTime())} by{' '}
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
const rtf = new Intl.RelativeTimeFormat('en', {
  localeMatcher: 'best fit',
  numeric: 'auto',
  style: 'long',
});

function fromNow(time: number) {
  const seconds = (time - Date.now()) / 1000;
  if (Math.abs(seconds) < 60) {
    return rtf.format(Math.round(seconds), 'seconds');
  }
  const minutes = seconds / 60;
  if (Math.abs(minutes) < 60) {
    return rtf.format(Math.round(minutes), 'minutes');
  }
  const hours = minutes / 60;
  if (Math.abs(hours) < 24) {
    return rtf.format(Math.round(hours), 'hours');
  }
  const days = hours / 24;
  if (Math.abs(days) < 7) {
    return rtf.format(Math.round(days), 'days');
  }
  const weeks = days / 7;
  if (Math.abs(weeks) < 52) {
    return rtf.format(Math.round(weeks), 'weeks');
  }
  return rtf.format(Math.round(days / 365), 'years');
}
