import type { BreadcrumbProps } from 'antd';
import { Link } from 'react-router-dom';

type Route = NonNullable<BreadcrumbProps['routes']> extends Array<infer T>
  ? T
  : never;
export default function itemRender(
  route: Route,
  params: any,
  routes: Array<Route>,
  paths: Array<string>,
) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
}
