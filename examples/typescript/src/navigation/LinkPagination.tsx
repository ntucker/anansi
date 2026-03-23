import { Pagination } from 'antd';
import { History } from 'history';
import parseLink from 'parse-link-header';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const handleChange = (history: History) => (page: number) => {
  history.push(history.location.pathname + `?page=${page}`);
};

interface PageProps extends RouteComponentProps {
  link: string;
}
function LinkPagination({ link, history }: PageProps) {
  const parsed = parseLink(link);
  const curPage =
    parsed && parsed.next ? Number.parseInt(parsed.next.page ?? '2') - 1
    : parsed && parsed.prev ? Number.parseInt(parsed.prev.page ?? '0') + 1
    : 1;
  let total, pageSize;
  if (!parsed) {
    total = 1;
    pageSize = 50;
  } else if (parsed.last) {
    total = Number.parseInt(parsed.last.page ?? '1');
    pageSize = Number.parseInt(parsed.last.per_page ?? '50');
  } else {
    pageSize = Number.parseInt(parsed.first?.per_page ?? '50');
    total = curPage;
  }
  return (
    <Pagination
      defaultCurrent={curPage}
      total={total * pageSize}
      pageSize={pageSize}
      onChange={handleChange(history)}
    />
  );
}

export default withRouter(LinkPagination);
