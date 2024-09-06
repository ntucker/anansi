import { memo } from 'react';
import {
  Route,
  Switch,
  withRouter,
  RouteChildrenProps,
} from 'react-router-dom';

import lazyPage from '@/components/lazyPage';

const Routes = ({ location }: RouteChildrenProps) => (
  <Switch location={location} key={location.pathname}>
    <Route exact path="/" component={lazyPage('Home/index')} />
    <Route exact path="/issues" component={lazyPage('Issues/index')} />
    <Route exact path="/graphql" component={lazyPage('GQL/index')} />
    <Route exact path="/posts" component={lazyPage('Posts/index')} />
    <Route exact path="/posts/new" component={lazyPage('Posts/PostCreate')} />
    <Route path="/post/:id/edit" component={lazyPage('Posts/PostEdit')} />
    <Route path="/post/:id" component={lazyPage('PostDetail/index')} />
    <Route path="/user/:id" component={lazyPage('User/index')} />
    <Route path="/slow" component={lazyPage('Slow/index')} />
    <Route path="/error" component={lazyPage('Error/index')} />
  </Switch>
);
export default withRouter(memo(Routes));
