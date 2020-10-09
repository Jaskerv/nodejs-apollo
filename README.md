# Full Stack NodeJs - Apollo GraphQL - NextJs - Typescript
Learning project to learn 
 - Typescript
 - NodeJs
 - Express
 - Apollo Server & Client
 - NextJs

## Services
These are the services required to run this application
 - Redis
 - PostgreSQL

## Running the application

Run ```docker-compose up``` to start required services.

**Dev**

```npm run dev```

**Prod**

```npm start```

# Notes

## tsconfig
Generate tsconfig
```npx tsconfig.json```

## nodemon vs tsc-watch

In my opinion, tsc-watch is better than nodemon.

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


## ApolloClient Error Policy
```errorPolicy:'all'``` is better than ```errorPolicy: 'none'```

