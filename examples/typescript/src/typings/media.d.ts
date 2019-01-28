declare module "*.gif" {
  let img: string;
  export default img;
}
declare module "*.svg" {
  let img: string;
  export default img;
}
declare module "*.jpg" {
  let img: string;
  export default img;
}
declare module "*.svg\?inline" {
  let Svg: React.Component;
  export default Svg;
}
declare module "*.scss" {
  type CSSMODULE = { [k:string]: string }
  let modules: CSSMODULE;
  export default modules;
}
