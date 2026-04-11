"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
exports.getUsersController = getUsersController;
const createUser_service_1 = __importDefault(require("./createUser.service"));
const user_repo_1 = require("./user.repo");
async function getUsersController(req, res) {
    const users = await (0, user_repo_1.getUsers)();
    res.status(200).json({ message: "Success!", users });
}
async function createUserController(req, res) {
    const user = await (0, createUser_service_1.default)(req.body.name, req.body.email, req.body.password);
    res.status(201).json({ message: "User Created", user });
}
