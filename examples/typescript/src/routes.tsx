import { memo } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { RouteChildrenProps } from 'react-router';
import lazyPage from 'components/lazyPage';

const Routes = ({ location }: RouteChildrenProps) => (
  <Switch location={location} key={location.pathname}>
    <Route exact path="/" component={lazyPage('Home')} />
    <Route exact path="/issues" component={lazyPage('Issues')} />
    <Route exact path="/posts" component={lazyPage('Posts')} />
    <Route exact path="/posts/new" component={lazyPage('Posts/PostCreate')} />
    <Route path="/post/:id/edit" component={lazyPage('Posts/PostEdit')} />
    <Route path="/post/:id" component={lazyPage('PostDetail')} />
    <Route path="/user/:id" component={lazyPage('User')} />
    <Route path="/slow" component={lazyPage('Slow')} />
    <Route path="/error" component={lazyPage('Error')} />
  </Switch>
);
export default withRouter(memo(Routes));
