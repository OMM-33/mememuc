# Grp 33 Mememuc API server
This is a implementation of a RESTful API server establishing the backend for our "mememuc" Meme Generator project.
The project is part of the WS 2022/2023 iteration of the course Online Multimedia at LMU Munich: https://www.medien.ifi.lmu.de/lehre/ws2223/omm/

## Libraries utilized:
Production:
| Name & Link | License | Description |
| ----------- | ------- | ----------- |
| [Express](https://expressjs.com/) | [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/) |Fast, unopinionated, minimalist web framework for Node.js |
| [Mongoose](https://mongoosejs.com/) | MIT | Wrapper library for interaction with MongoDB with a schema-based data modeling approach, with built-in type casting, validation, query building and more | 
| [Multer](https://github.com/expressjs/multer) | [MIT](https://github.com/expressjs/multer/blob/master/LICENSE) | Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency. |
| [multer-gridfs-storage](https://github.com/devconcept/multer-gridfs-storage) | [MIT](https://github.com/devconcept/multer-gridfs-storage/blob/master/LICENSE) | GridFS storage engine for Multer to store uploaded files directly to MongoDb. Due to [this issue](https://github.com/devconcept/multer-gridfs-storage/issues/490) we use a currently unapproved Pull Request version of the official npm version (see package.json) that fixes this issue. In the future this change should be rolled back as soon as the issue is addressed in the main project. Until then the dependency needs to be manually updated. Downgrading the dependency led to security vulnerabilities, which is why we decided against it. |
| [cors](https://www.npmjs.com/package/cors) | MIT | cors is a middleware that can be used to enable CORS with various options. |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | MIT | JsonWebToken implementation for node.js |

Additionally during development:
| Name & Link | Description |
| ----------- | ----------- |
| [Nodemon](https://nodemon.io/) | Monitors for any changes in source code and automatically restarts the node.js server |
| [Dotenv](https://github.com/motdotla/dotenv) | Zero-dependency module that loads environment variables from a .env file into process.env |

---

## Tutorials utilized:

| Name & Link | Author & Link |
| ----------- | ------------- |
| [Build A REST API With Node.js, Express, & MongoDB - Quick](https://www.youtube.com/watch?v=fgTGADljAeg) | [WebDevSimplified](https://www.youtube.com/@WebDevSimplified) |
| [Mongoose Crash Course - Beginner Through Advanced](https://www.youtube.com/watch?v=DZBGEVgL2eE) | [WebDevSimplified](https://www.youtube.com/@WebDevSimplified) |
| [How to upload/store images in MongoDB using Node.js, Express & Multer](https://www.bezkoder.com/node-js-upload-store-images-mongodb/) | [BezKoder](https://www.bezkoder.com/about/) |
