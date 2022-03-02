import { History } from 'history';
import { Controller } from '@rest-hooks/core';
import { Route, RouteController } from '@anansi/router';

export type CreateRouter = (
  history: History,
) => RouteController<Route<Controller, any>>;

export type Root = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
  head?: React.ReactNode;
  title: string;
}) => JSX.Element;

export type RenderApp = (Root: Root) => JSX.Element;
