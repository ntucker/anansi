import TextField from '@material-ui/core/TextField';
import { PostResource } from 'data/resources';
import Button from '@material-ui/core/Button';
import useForm from './useForm';

type FormProps = {
  onSubmit: Function;
  initialValues: object;
};
export default function PostForm({ onSubmit, initialValues }: FormProps) {
  const [values, handleChange, handleSubmit] = useForm(
    PostResource,
    initialValues,
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <div>
        <TextField
          id="outlined-name"
          label="Title"
          value={values.title}
          onChange={handleChange('title')}
          margin="normal"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          id="outlined-name"
          label="Body"
          value={values.body}
          onChange={handleChange('body')}
          margin="normal"
          variant="outlined"
          fullWidth
          multiline
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </form>
  );
}
