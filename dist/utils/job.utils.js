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
exports.updateStatus = exports.isRunning = exports.formatJobMessage = exports.filterNewJobs = void 0;
const filterNewJobs = (allJobs, existingIds) => {
    return allJobs.filter(job => !existingIds.includes(job.id));
};
exports.filterNewJobs = filterNewJobs;
const formatJobMessage = (job) => {
    return `
        [Link](https://djinni.co/${job.jobLink}) 
        ${job.companyName}
        ${job.jobTitle}
        ${job.infoTags.join(', ')}
        ${job.description}
    `;
};
exports.formatJobMessage = formatJobMessage;
const isRunning = (_a) => __awaiter(void 0, [_a], void 0, function* ({ statusFile, fs }) {
    try {
        const data = yield fs.readFile(statusFile, 'utf8');
        const { isRunning } = JSON.parse(data);
        return isRunning;
    }
    catch (error) {
        console.error('Error reading status file:', error);
        return false;
    }
});
exports.isRunning = isRunning;
const updateStatus = (isRunning, statusFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = { isRunning };
        yield fs.writeFile(statusFile, JSON.stringify(status, null, 2));
    }
    catch (error) {
        console.error('Error writing status file:', error);
    }
});
exports.updateStatus = updateStatus;
