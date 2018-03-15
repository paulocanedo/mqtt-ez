# MQTT-EZ
A simple tool for mqtt management, you can use as firefox-addon or deploy anywhere

## build from source
```bash
git clone https://github.com/paulocanedo/mqtt-ez.git
cd mqtt-ez
npm install
npm run build
```

your compiled files will be in dist folder.

## firefox-addon
if you want to run the addon for firefox, please first install [web-ext.](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext)

```bash
npm install --global web-ext
```

and then open dist folder to run the addon:

```bash
cd dist
web-ext run
```
