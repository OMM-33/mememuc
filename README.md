# MemeMuc

## ℹ️ About
Meme generator (bonus project of LMU Munich course OMM WS22/23)
### 👥 Team Members
| Felix Bastian | Alexander Schmidt | You Sun Song | Ines Trautmannsheimer |
|---|---|---|---|

## 🛫 Developing
1. Make sure [Node.js](https://nodejs.org/) version 18+ is installed (LTS recommended), includes npm.
2. Install recommended project extensions for your code editor (see `.vscode/extensions.json`).
3. Install project dependencies locally (for client & server): `npm install`
4. Start a local development server (for client & server): `npm run dev`

## 🏃 Running the [MemeMuc Template](https://github.com/mimuc/mememuc-template)
1. In order for the [MemeMuc Template](https://github.com/mimuc/mememuc-template) to be able to run `mongorestore mongodb://127.0.0.1:65535 --db omm-ws2223 data` as specified within `./mongoserver/package.json` you need to have a local installation of MongoDB. The community edition suffices. It can be downloaded in the [MongoDB download center](https://www.mongodb.com/try/download/community).
2. Finally you will just need to run `cd mememuc-launcher && npm run installall && npm start`

## 📦 Used Packages
### Development
| Package | License | Use |
|:--- |:--- |:--- |
| [Vite](https://www.npmjs.com/package/vite) | [MIT](https://github.com/vitejs/vite/blob/main/LICENSE) | Frontend Tooling (Dev Server & Bundling)
| [Svelte](https://www.npmjs.com/package/svelte) | [MIT](https://github.com/sveltejs/svelte/blob/master/LICENSE.md) | Frontend compile-time Framework
| [PostCSS](https://www.npmjs.com/package/postcss) ([Autoprefixer](https://www.npmjs.com/package/autoprefixer)) | [MIT](https://github.com/postcss/postcss/blob/main/LICENSE) ([MIT](https://github.com/postcss/autoprefixer/blob/main/LICENSE)) | CSS post-processing (for auto browser prefixes)
| [ESLint](https://www.npmjs.com/package/eslint) ([ESLint Plugin Svelte](https://www.npmjs.com/package/eslint-plugin-svelte)) | [MIT](https://github.com/eslint/eslint/blob/main/LICENSE) ([MIT](https://github.com/ota-meshi/eslint-plugin-svelte/blob/main/LICENSE)) | Code Linting (for Svelte)

### Bundled Code
| Package | License | Use |
|:--- |:--- |:--- |
| [Chart.js](https://www.npmjs.com/package/chart.js) | [MIT](https://github.com/chartjs/Chart.js/blob/master/LICENSE.md) | Rendering of statistics graphs |
| [html2canvas](https://www.npmjs.com/package/html2canvas) | [MIT](https://github.com/niklasvh/html2canvas/blob/master/LICENSE) | Rendering Memes by capturing real DOM elements |
| [pretty-bytes](https://www.npmjs.com/package/pretty-bytes) | [MIT](https://github.com/sindresorhus/pretty-bytes/blob/main/license) | Format bytes for better readability |
| [svelte-spa-router](https://www.npmjs.com/package/svelte-spa-router) | [MIT](https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/LICENSE.md) | Routing for the frontend |
| [Tippy.js](https://www.npmjs.com/package/tippy.js) | [MIT](https://github.com/atomiks/tippyjs/blob/master/LICENSE) | Tooltips (e. g. for Speech Input) |
