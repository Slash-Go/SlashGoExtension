# SlashGo Extension

## How to run

```bash
// install dependencies
$ npm i

// build files to `/dist` directory
$ npm run build

// (Alternatively) You can also use live reloading for vite/tailwind using
$ npm run dev

// Open up Google Chrome and navigate to `chrome://extensions`
// Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
// Click the `Load Unpacked` option and select the `/dist` directory you built above.
// You should see the SlashGo Extension installed in your browser.
```

### Supported Browsers

SlashGo uses [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) in order to build a future-proof, cross-browser web extension, especially given that nearly all Chrome-* browsers support MV3 already. As such, SlashGo is supported on all such browsers, the notable exception being **Mozilla Firefox**, which is due to provide MV3 support [later this year](https://blog.mozilla.org/addons/2022/06/08/manifest-v3-firefox-developer-preview-how-to-get-involved/). 
