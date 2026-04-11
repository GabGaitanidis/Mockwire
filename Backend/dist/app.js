"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const rules_route_1 = __importDefault(require("./modules/Rules/rules.route"));
const dynamic_route_1 = __importDefault(require("./modules/URL/dynamic.route"));
const error_middleware_1 = require("./middlewares/error.middleware");
const user_route_1 = __importDefault(require("./modules/User/user.route"));
const auth_routes_1 = __importDefault(require("./modules/Auth/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/users", user_route_1.default);
app.use("/rules", rules_route_1.default);
app.use("/dynamics", dynamic_route_1.default);
app.get("/health", (req, res) => {
    res.send("Server good");
});
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
