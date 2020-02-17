declare module 'gulp-prettier' {
  function prettier(options?: Record<string, any>): NodeJS.ReadWriteStream;
  export = prettier;
}
