import { useState, SyntheticEvent } from 'react';
import { AbstractInstanceType } from 'rest-hooks';
import { Resource } from '@rest-hooks/rest';

export default function useForm<T extends typeof Resource>(
  R: T,
  initialValues: Partial<AbstractInstanceType<T>>,
): [
  Readonly<AbstractInstanceType<T>>,
  (
    name: string,
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void,
  (
    onSubmit: (v: Partial<AbstractInstanceType<T>>) => any,
  ) => (e?: React.SyntheticEvent | object) => void,
] {
  const [values, setValues] = useState(() => R.fromJS(initialValues));

  const handleChange =
    (name: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };
  const handleSubmit =
    (onSubmit: (v: object) => any) => (e?: React.SyntheticEvent | object) => {
      if (e && 'preventDefault' in e) {
        e.preventDefault();
      }
      onSubmit(values);
    };
  return [values, handleChange, handleSubmit];
}
