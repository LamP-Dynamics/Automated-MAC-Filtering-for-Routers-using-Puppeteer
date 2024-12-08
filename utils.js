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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppet = exports.sendLog = exports.PRIVILEGED = exports.ADMIN_PASS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ADMIN_PASS = process.env.ADMIN_PASS || '';
exports.PRIVILEGED = ((_a = process.env.PRIVILEGED) === null || _a === void 0 ? void 0 : _a.split('-')) || '';
const sendLog = (message) => {
    console.log('=========================');
    console.log(message);
};
exports.sendLog = sendLog;
const puppet = (page, callback, message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message);
    yield page.waitForNavigation({ waitUntil: 'networkidle0' });
    yield callback();
});
exports.puppet = puppet;
