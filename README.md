# Learning Backend Nodejs
Using Typescript.

## tsconfig

```npx tsconfig.json```

## nodemon vs tsc-watch
### nodemon
```
  "watch": "tsc -w",
  "nodemon": "nodemon ./dist/index.js",
  "dev": "concurrently --kill-others \"npm:watch\" \"npm:nodemon\""
```
#### requires:
 - concurrently
 - nodemon
### tsc-watch
```
  "dev": "tsc-watch --onSuccess \"node ./dist/index.js\""
```
#### requires:
 - tsc-watch
