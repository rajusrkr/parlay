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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistration = void 0;
const user_schema_1 = require("../../../shared/src/validators/user.schema");
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // do zod validation here
    const parseRes = user_schema_1.registerUserSchema.safeParse(req.body);
    console.log(parseRes);
});
exports.userRegistration = userRegistration;
