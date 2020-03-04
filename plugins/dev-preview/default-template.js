
const template = ({
  output, scaffolding, prepend, append,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Development Preview</title>
  <!-- Start: User Prepend Scripts -->
  ${prepend.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
  <!-- End: User Prepend Scripts -->
</head>

<body>
  <div id="dev-preview-app"></div>

  <!-- Start: Dev-Preview Plugin Style and Scripts -->
  <link rel="stylesheet" href="./${output}/dev-preview.css">
  <script src="https://unpkg.com/vue@2.6.10/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router@3.1.3/dist/vue-router.js"></script>
  <script>;__BIOTOPE_DEV_PREVIEW_ROOT="${output}";</script>
  <script>;__BIOTOPE_DEV_PREVIEW_PREFIX="${scaffolding}";</script>
  <script src="./${output}/dev-preview.js"></script>
  <!-- End: Dev-Preview Plugin Style and Scripts -->

  <!-- Start: User Append Scripts -->
  ${append.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
  <!-- End: User Append Scripts -->
</body>
</html>
`;

module.exports = template;
