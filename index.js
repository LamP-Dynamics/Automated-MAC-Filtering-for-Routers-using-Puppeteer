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
const _168_0_1_1 = require("./168_0_1");
const utils_1 = require("./utils");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let trial = 0;
    while (trial >= 0) {
        try {
            yield (0, _168_0_1_1.admin_168_0_1)();
            trial = -1;
        }
        catch (err) {
            trial += 1;
            (0, utils_1.sendLog)(err + `\nFailed. Retrying for ${trial} time...`);
        }
    }
}))();
