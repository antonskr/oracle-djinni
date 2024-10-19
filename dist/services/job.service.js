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
exports.JobDataService = void 0;
const node_html_parser_1 = require("node-html-parser");
class JobDataService {
    constructor(token) {
        this.token = token;
    }
    getJobListings() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.fetchJobData();
            return this.parseJobItems(html);
        });
    }
    fetchJobData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://djinni.co/my/dashboard/', {
                method: 'GET',
                headers: { 'cookie': this.token }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return yield response.text();
        });
    }
    parseJobItems(html) {
        var _a, _b;
        const root = (0, node_html_parser_1.parse)(html);
        const list = root.querySelector('.list-unstyled');
        const items = (list === null || list === void 0 ? void 0 : list.querySelectorAll('li')) || [];
        const jobs = [];
        for (const item of items) {
            const id = item.getAttribute('id');
            const companyName = (_a = item.querySelector('.text-body')) === null || _a === void 0 ? void 0 : _a.text.replace(/\n/g, '').trim();
            const info = item.querySelector('.fw-medium');
            const infoTags = Array.from((info === null || info === void 0 ? void 0 : info.querySelectorAll('.text-nowrap')) || []).map(tag => tag === null || tag === void 0 ? void 0 : tag.text.replace(/\n/g, '').trim());
            const jobData = item.querySelector('.job-item__title-link');
            const jobTitle = jobData === null || jobData === void 0 ? void 0 : jobData.text.replace(/\n/g, '').trim();
            const jobLink = jobData === null || jobData === void 0 ? void 0 : jobData.getAttribute('href');
            const description = (_b = item.querySelector('.js-truncated-text')) === null || _b === void 0 ? void 0 : _b.text;
            if (companyName && infoTags.length && jobTitle && jobLink && description) {
                jobs.push({
                    id,
                    companyName,
                    jobTitle,
                    jobLink,
                    infoTags,
                    description,
                });
            }
        }
        return jobs;
    }
}
exports.JobDataService = JobDataService;
