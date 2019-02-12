
declare module 'prerender-spa-plugin' {
  import { Plugin } from 'webpack';

  class PrerenderSpaPlugin extends Plugin {
    constructor(options?: PrerenderSpaPlugin.Options);
  }

  namespace PrerenderSpaPlugin {
    interface RenderedRoute {
      route: string;
      html: string;
      output: string;
    }

    interface PuppeteerRendererOptions {
      injectProperty?: string;
      inject?: { [key:string]: any };
      maxConcurrentRoutes?: number;
      renderAfterDocumentEvent?: string;
      renderAfterElementExists?: string;
      renderAfterTime?: number;

      ignoreHTTPSErrors?: boolean;
      headless?: boolean;
      executablePath?: string;
      slowMo?: number;
      defaultViewport?: {
        width: number;
        height: number;
        deviceScaleFactor?: number;
        isMobile?: boolean;
        hasTouch?: boolean;
        isLandscape?: boolean;
      };
      args: string[];
      ignoreDefaultArgs?: boolean|string[];
      handleSIGINT?: boolean;
      handleSIGTERM?: boolean;
      handleSIGHUP?: boolean;
      timeout?: number;
      dumpio?: boolean;
      userDataDir?: string;
      env?: { [key:string]: any };
      devtools?: boolean;
      pipe?: boolean;
    }

    class PuppeteerRenderer {
      constructor(options?: PuppeteerRendererOptions);
    }

    interface Options {
      staticDir?: string;
      outputDir?: string;
      indexPath?: string;
      routes?: string[];
      postProcess?: (renderedRoute: RenderedRoute) => RenderedRoute;
      minify?: {
        collapseBooleanAttributes?: boolean;
        collapseWhitespace?: boolean;
        decodeEntities?: boolean;
        keepClosingSlash?: boolean;
        sortAttributes?: boolean;
      };
      server?: {
        port: number;
      };
      renderer: PuppeteerRenderer;
    }
  }

  export = PrerenderSpaPlugin;
}
