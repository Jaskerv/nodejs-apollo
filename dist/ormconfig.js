"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'lireddit',
    entities: ['dist/entities/*.js'],
    migrations: ['dist/migrations/*.js'],
};
//# sourceMappingURL=ormconfig.js.map