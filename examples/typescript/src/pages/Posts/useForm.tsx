import { useState, SyntheticEvent } from 'react';
import { Resource, AbstractInstanceType } from 'rest-hooks';

export default function useForm<T extends typeof Resource>(
  R: T,
  initialValues: Partial<AbstractInstanceType<T>>,
): [
  Readonly<AbstractInstanceType<T>>,
  (name: string) => (event: SyntheticEvent<Element, Event>) => void,
  (
    onSubmit: (v: Partial<AbstractInstanceType<T>>) => any,
  ) => (e: SyntheticEvent<Element, Event>) => void
] {
  const [values, setValues] = useState(() => R.fromJS(initialValues));

  const handleChange = (name: string) => (event: SyntheticEvent) => {
    setValues(R.fromJS({ ...values, [name]: event.target.value }));
  };
  const handleSubmit = (onSubmit: (v: object) => any) => (e: React.SyntheticEvent
  ) => {
    e.preventDefault();
    onSubmit(values);
  };
  return [values, handleChange, handleSubmit];
}
