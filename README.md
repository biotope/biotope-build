# gulp-build-framework

## Options

All build framework options can be set in local /projectConfig.js (<5.x /projectConfig.json)

Description will follow soon, see default config: <https://github.com/frontend-framework/build-framework/blob/master/config.js> 


## Migration checklists

* <https://github.com/frontend-framework/frontend-framework/wiki/Migration-Checklist-3.x-to-4.x>
* <https://github.com/frontend-framework/frontend-framework/wiki/Migration-Checklist-4.x-to-5.x>

### Troubleshooting

- High cpu usage on windows: the watch task uses polling, which can require a high cpu usage. If your system runs slow or crashes, try to increase the interval of the watch task. 

  Current defaults: Unix 100, Windows 250 
