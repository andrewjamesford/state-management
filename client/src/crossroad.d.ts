// crossroad.d.ts
declare module "crossroad" {
  import React from "react";

  export interface RouterProps {
    children: React.ReactNode;
  }

  export interface RouteProps {
    exact?: boolean;
    path: string;
    component: React.ComponentType<any>;
  }

  export interface SwitchProps {
    redirect?: string;
    children: React.ReactNode;
  }

  export default class Router extends React.Component<RouterProps> {}
  export class Route extends React.Component<RouteProps> {}
  export class Switch extends React.Component<SwitchProps> {}
}
