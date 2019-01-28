import { UserResource } from 'data/models';
import { hooks, selectors } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function User({ match }: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const author = hooks.useResource(UserResource, selectors.Single, { id });
  if (!author) return null;
  return (
    <>
      <Typography variant="h5" component="h3" style={{ flex: '1 1 50%' }}>
        {author.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {author.email}
        <br />
        {author.phone}
        <br />
        <a href={`https://${author.website}`}>{author.website}</a>
      </Typography>
      <Paper>
        <Table>
          <TableBody>
            {Object.entries(author.address).map(
              ([key, value]: [string, any]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {capFirst(key)}
                  </TableCell>
                  <TableCell align="right">{value.toString()}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
