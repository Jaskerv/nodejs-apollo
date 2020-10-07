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
const Post_1 = __importDefault(require("../entities/Post"));
let PostResolver = class PostResolver {
    posts() {
        return Post_1.default.find({
            order: {
                id: 'ASC',
            },
        });
    }
    post(id) {
        return Post_1.default.findOne(id);
    }
    createPost(title, description, likes, views) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = Post_1.default.create({
                title, description, likes, views,
            });
            yield post.save();
            return post;
        });
    }
    updatePost(id, title, description, likes, views) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findOne(id);
            if (!post)
                return null;
            if (typeof title === 'string')
                post.title = title;
            if (typeof description === 'string')
                post.description = description;
            if (typeof likes === 'number')
                post.likes = likes;
            if (typeof views === 'number')
                post.views = views;
            yield post.save();
            return post;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findOne(id);
            if (!post)
                return false;
            if (typeof (yield post.remove()) !== 'undefined') {
                return true;
            }
            return false;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Post_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.default),
    __param(0, type_graphql_1.Arg('title')),
    __param(1, type_graphql_1.Arg('description')),
    __param(2, type_graphql_1.Arg('likes', () => type_graphql_1.Int, { defaultValue: 0 })),
    __param(3, type_graphql_1.Arg('views', () => type_graphql_1.Int, { defaultValue: 0 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.default, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int, { nullable: false })),
    __param(1, type_graphql_1.Arg('title', { nullable: true })),
    __param(2, type_graphql_1.Arg('description', { nullable: true })),
    __param(3, type_graphql_1.Arg('likes', () => type_graphql_1.Int, { defaultValue: 0 })),
    __param(4, type_graphql_1.Arg('views', () => type_graphql_1.Int, { defaultValue: 0 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int, { nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.default = PostResolver;
//# sourceMappingURL=Post.js.map