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
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_168_0_1 = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("./utils");
const admin_168_0_1 = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.sendLog)('Starting...');
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto('http://192.168.0.1');
    // Login to the router
    yield (0, utils_1.puppet)(page, () => __awaiter(void 0, void 0, void 0, function* () {
        const passwordInput = yield page.$('#login_pass');
        if (passwordInput) {
            yield passwordInput.type(utils_1.ADMIN_PASS || '');
        }
        else {
            throw new Error('Password input field not found');
        }
        const loginButton = yield page.$('#Login');
        if (loginButton) {
            yield loginButton.click();
        }
        else {
            throw new Error('Login button not found');
        }
    }), 'Logging in...');
    // Get into admin menu
    yield (0, utils_1.puppet)(page, () => __awaiter(void 0, void 0, void 0, function* () {
        const advancedButton = yield page.$('input[name="exit"]');
        if (advancedButton) {
            yield advancedButton.click();
        }
        else {
            throw new Error('Advanced button not found');
        }
    }), 'Getting into admin menu...');
    // Get into advanced menu
    yield (0, utils_1.puppet)(page, () => __awaiter(void 0, void 0, void 0, function* () {
        const advancedTopNav = yield page.$('#Advanced_topnav');
        if (advancedTopNav) {
            yield advancedTopNav.click();
        }
        else {
            throw new Error('Advanced menu not found');
        }
    }), 'Getting into advanced menu...');
    // Get into MAC Filtering menu
    yield (0, utils_1.puppet)(page, () => __awaiter(void 0, void 0, void 0, function* () {
        const advancedSubNav = yield page.$('#Advanced_subnav');
        if (advancedSubNav) {
            const thirdListItem = yield advancedSubNav.$('li:nth-child(3) a');
            if (thirdListItem) {
                yield thirdListItem.click();
            }
            else {
                throw new Error('Third list item not found');
            }
        }
        else {
            throw new Error('Advanced subnav not found');
        }
    }), 'Getting into MAC Filtering menu...');
    // Manipulating MAC filtering list
    yield (0, utils_1.puppet)(page, () => __awaiter(void 0, void 0, void 0, function* () {
        const listed = [];
        const table = yield page.$('.formlisting');
        if (table) {
            const rows = yield table.$$('tr');
            for (let index = 0; index < rows.length; index++) {
                if (index > 0) {
                    const data = {
                        mac: '',
                        name: ''
                    };
                    const row = rows[index];
                    const cells = yield row.$$('td');
                    const input_mac = yield cells[1].$(`input[name="mac_addr_${index - 1}"]`);
                    const input_name = yield cells[4].$(`input[name="mac_hostname_${index - 1}"]`);
                    if (input_mac) {
                        const value = yield input_mac.evaluate((el) => el.value);
                        data.mac = value;
                    }
                    if (input_name) {
                        const value = yield input_name.evaluate((el) => el.value);
                        data.name = value;
                    }
                    if (data.mac && data.name) {
                        if (!utils_1.PRIVILEGED.includes(data.mac)) {
                            console.log(`${data.mac} of ${data.name}`);
                            listed.push(data);
                        }
                        else {
                            console.log(`${data.mac} of ${data.name} is privileged`);
                        }
                    }
                    else {
                        console.log('Empty Data on row', index);
                    }
                }
            }
        }
        else {
            throw new Error('Table with class formlisting not found');
        }
    }), 'Updating MAC filtering list...');
    // Take a screenshot of the page
    yield page.screenshot({ path: './dev/screenshot.png' });
    yield browser.close();
});
exports.admin_168_0_1 = admin_168_0_1;
