"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../entities/User"));
let PasswordConfirmInput = class PasswordConfirmInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PasswordConfirmInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PasswordConfirmInput.prototype, "confirmPassword", void 0);
PasswordConfirmInput = __decorate([
    type_graphql_1.InputType()
], PasswordConfirmInput);
let UsernamePasswordConfirmInput = class UsernamePasswordConfirmInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordConfirmInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordConfirmInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordConfirmInput.prototype, "confirmPassword", void 0);
UsernamePasswordConfirmInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordConfirmInput);
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
const idDoesNotExistError = new apollo_server_express_1.ApolloError("This user doesn't exist");
const passwordMismatchError = new apollo_server_express_1.UserInputError('Password mismatch');
let UserResolver = class UserResolver {
    users() {
        return User_1.default.find({
            order: {
                id: 'ASC',
            },
        });
    }
    user(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne(id);
            if (!user)
                throw idDoesNotExistError;
            return user;
        });
    }
    register(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.password !== options.confirmPassword)
                throw passwordMismatchError;
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const user = User_1.default.create({
                username: options.username, password: hashedPassword,
            });
            yield user.save();
            return user;
        });
    }
    updatePassword(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne(id);
            if (!user)
                throw idDoesNotExistError;
            if (typeof options.password !== 'undefined'
                && typeof options.confirmPassword !== 'undefined'
                && options.password === options.confirmPassword) {
                const hashedPassword = yield argon2_1.default.hash(options.password);
                user.password = hashedPassword;
            }
            else
                throw passwordMismatchError;
            yield user.save();
            return user;
        });
    }
    login(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ username: options.username });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('username does not exist');
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid)
                throw new apollo_server_express_1.AuthenticationError('Invalid login');
            return user;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [User_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Query(() => User_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordConfirmInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PasswordConfirmInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updatePassword", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.default = UserResolver;
//# sourceMappingURL=User.js.map