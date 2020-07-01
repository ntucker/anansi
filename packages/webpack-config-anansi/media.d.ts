declare module '*.svg' {
  let ReactComponent: import('react').SFC<import('react').SVGProps<SVGElement>>;
  let url: string;
  export { ReactComponent };
  export default url;
}
declare module '*.scss' {
  type CSSMODULE = { [k: string]: string };
  let modules: CSSMODULE;
  export = modules;
}

declare module '*.png' {
  let url: string;
  export default url;
}
declare module '*.jpg' {
  let url: string;
  export default url;
}
declare module '*.gif' {
  let url: string;
  export default url;
}
declare module '*.ico' {
  let url: string;
  export default url;
}
declare module '*.pdf' {
  let url: string;
  export default url;
}
declare module '*.webm' {
  let url: string;
  export default url;
}
declare module '*.webp' {
  let url: string;
  export default url;
}
declare module '*.mp4' {
  let url: string;
  export default url;
}
declare module '*.otf' {
  let url: string;
  export default url;
}
declare module '*.eot' {
  let url: string;
  export default url;
}
declare module '*.woff2' {
  let url: string;
  export default url;
}
declare module '*.woff' {
  let url: string;
  export default url;
}
declare module '*.ttf' {
  let url: string;
  export default url;
}
declare module '*.md' {
  let content: string;
  export default content;
}
declare module '*.txt' {
  let content: string;
  export default content;
}
