
declare module 'local-web-server' {
  interface ListenOptions {
    port?: number;
    https?: boolean;
    compress?: boolean;
    directory?: string;
    spa?: string;
  }

  class LocalWebServer {
    public listen(options: ListenOptions): void;
  }

  namespace LocalWebServer {}

  export = LocalWebServer;
}
