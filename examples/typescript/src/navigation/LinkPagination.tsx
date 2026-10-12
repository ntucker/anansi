import { Pagination } from 'antd';
import parseLink from 'parse-link-header';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const handleChange =
  (history: RouteComponentProps['history']) =>
  (page: number, pageSize?: number) => {
    history.push(history.location.pathname + `?page=${page}`);
  };

interface PageProps extends RouteComponentProps {
  link: string;
}
function LinkPagination({ link, history }: PageProps) {
  const parsed = parseLink(link);
  let curPage = 1;
  if (parsed?.next) curPage = Number(parsed.next.page) - 1;
  else if (parsed?.prev) curPage = Number(parsed.prev.page) + 1;
  let total, pageSize;
  if (!parsed) {
    total = 1;
    pageSize = 50;
  } else if (parsed.last) {
    total = Number(parsed.last.page);
    pageSize = Number(parsed.last.per_page);
  } else {
    pageSize = Number(parsed.first?.per_page ?? 50);
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
