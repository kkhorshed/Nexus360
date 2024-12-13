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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = exports.createEndpoint = exports.notificationApi = exports.integrationApi = exports.authApi = void 0;
var axios_1 = require("axios");
// Create a new axios instance with default config
var createApiClient = function (baseURL) {
    var client = axios_1.default.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // Add request interceptor for auth
    client.interceptors.request.use(function (config) {
        var token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = "Bearer ".concat(token);
        }
        return config;
    }, function (error) { return Promise.reject(error); });
    // Add response interceptor for error handling
    client.interceptors.response.use(function (response) { return response; }, function (error) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                // Handle token refresh or logout
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return [2 /*return*/, Promise.reject(error)];
        });
    }); });
    return client;
};
// Default service URLs
var DEFAULT_AUTH_URL = 'http://localhost:3001';
var DEFAULT_INTEGRATION_URL = 'http://localhost:3002';
var DEFAULT_NOTIFICATION_URL = 'http://localhost:3003';
// Create API clients with environment-aware URLs
exports.authApi = createApiClient(typeof process !== 'undefined' && process.env.VITE_AUTH_SERVICE_URL ||
    typeof window !== 'undefined' && ((_a = window.__ENV) === null || _a === void 0 ? void 0 : _a.VITE_AUTH_SERVICE_URL) ||
    DEFAULT_AUTH_URL);
exports.integrationApi = createApiClient(typeof process !== 'undefined' && process.env.VITE_INTEGRATION_HUB_URL ||
    typeof window !== 'undefined' && ((_b = window.__ENV) === null || _b === void 0 ? void 0 : _b.VITE_INTEGRATION_HUB_URL) ||
    DEFAULT_INTEGRATION_URL);
exports.notificationApi = createApiClient(typeof process !== 'undefined' && process.env.VITE_NOTIFICATION_SERVICE_URL ||
    typeof window !== 'undefined' && ((_c = window.__ENV) === null || _c === void 0 ? void 0 : _c.VITE_NOTIFICATION_SERVICE_URL) ||
    DEFAULT_NOTIFICATION_URL);
// API utilities
var createEndpoint = function (client, path) { return ({
    get: function (config) {
        return client.get(path, config).then(function (res) { return res.data; });
    },
    getById: function (id, config) {
        return client.get("".concat(path, "/").concat(id), config).then(function (res) { return res.data; });
    },
    create: function (data, config) {
        return client.post(path, data, config).then(function (res) { return res.data; });
    },
    update: function (id, data, config) {
        return client.put("".concat(path, "/").concat(id), data, config).then(function (res) { return res.data; });
    },
    delete: function (id, config) {
        return client.delete("".concat(path, "/").concat(id), config).then(function (res) { return res.data; });
    }
}); };
exports.createEndpoint = createEndpoint;
// Helper functions
var handleApiError = function (error) {
    var _a, _b, _c, _d, _e;
    if (axios_1.default.isAxiosError(error)) {
        return {
            message: ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message,
            status: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500,
            errors: (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors
        };
    }
    return {
        message: 'An unexpected error occurred',
        status: 500
    };
};
exports.handleApiError = handleApiError;
