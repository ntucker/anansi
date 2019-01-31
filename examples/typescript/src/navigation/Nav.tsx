import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default () => (
  <AppBar position="static">
    <Tabs>
      <Tab label="Home" to="/" component={Link} />
      <Tab label="Posts" to="/posts" component={Link} />
      <Tab label="Slow" to="/slow" component={Link} />
      <Tab label="Error" to="/error" component={Link} />
    </Tabs>
  </AppBar>
);
