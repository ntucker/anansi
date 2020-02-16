import { ComponentType } from 'react';

declare module '*.gif' {
  let img: string;
  export default img;
}
declare module '*.svg' {
  let content: ComponentType<any>;
  export default content;
}
declare module '*.jpg' {
  let img: string;
  export default img;
}
declare module '*file\.svg' {
  let img: string;
  export default img;
}
declare module '*.scss' {
  type CSSMODULE = { [k: string]: string };
  let modules: CSSMODULE;
  export default modules;
}
