import ResourceLoader from 'https://unpkg.com/@biotope/resource-loader@1.4.2/lib/index.esm.js';
new ResourceLoader({
  handler: [
    {
      match: ({resource, response}) => true,
      handle: ({resource, response}) => {
        const script = document.createElement('script');
        script.src = resource.path;
        script.async = true;
        script.type = 'module';
        script.charset = 'utf-8';
        document.body.append(script);
        console.log(resource.path)
      }
    }
  ]
});