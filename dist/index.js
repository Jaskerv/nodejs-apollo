"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const colors_1 = __importDefault(require("colors"));
const User_1 = __importDefault(require("./resolvers/User"));
const Post_1 = __importDefault(require("./resolvers/Post"));
const constants_1 = require("./constants");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'docker',
        password: 'docker',
        database: 'lireddit',
        entities: [path_1.default.join(__dirname, './entities/*')],
        migrations: [path_1.default.join(__dirname, './migrations/*')],
        logging: true,
    });
    yield conn.runMigrations();
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [Post_1.default, User_1.default],
            validate: false,
        }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(constants_1.__port__, () => {
        console.log(`\nServer started on port ${colors_1.default.yellow(`${constants_1.__port__}`)}\n`);
        console.log(`${'Graphql playgound here:'.blue} ${colors_1.default.magenta.underline(`http://localhost:${constants_1.__port__}/graphql`)} 🚀\n`);
    });
});
main();
//# sourceMappingURL=index.js.map