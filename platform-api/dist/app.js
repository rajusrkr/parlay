"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
// Routes
const user_route_1 = __importDefault(require("./routes/user.route"));
exports.app.use("/api/v1/user", user_route_1.default);
const admin_route_1 = __importDefault(require("./routes/admin.route"));
exports.app.use("/api/v1/admin", admin_route_1.default);
