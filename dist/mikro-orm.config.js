"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
exports.default = {
    dbName: 'lireddit',
    debug: !constants_1.__prod__,
    type: 'postgresql',
    user: 'docker',
    password: 'docker',
    entities: [Post_1.Post],
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
};
//# sourceMappingURL=mikro-orm.config.js.map