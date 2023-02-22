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

## Running the [MemeMuc Template](https://github.com/mimuc/mememuc-template)
1. In order for the [MemeMuc Template](https://github.com/mimuc/mememuc-template) to be able to run `mongorestore mongodb://127.0.0.1:65535 --db omm-ws2223 data` as specified within `./mongoserver/package.json` you need to have a local installation of MongoDB. The community edition suffices. It can be downloaded in the [MongoDB download center](https://www.mongodb.com/try/download/community).
2. Finally you will just need to run `cd mememuc-launcher && npm run installall && npm start`
