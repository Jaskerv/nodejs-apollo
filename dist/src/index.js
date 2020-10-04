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
const Post_1 = require("./entities/Post");
const ormconfig_1 = __importDefault(require("../ormconfig"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection(Object.assign(Object.assign({}, ormconfig_1.default), { entities: [Post_1.Post], migrations: [path_1.default.join(__dirname, './migrations/*')], logging: true }));
    yield conn.runMigrations();
});
main();
//# sourceMappingURL=index.js.map