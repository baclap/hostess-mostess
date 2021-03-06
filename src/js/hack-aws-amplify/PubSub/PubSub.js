"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
require("../Common/Polyfills");
var Observable = require("zen-observable");
var Logger_1 = require("../Common/Logger");
var Providers_1 = require("./Providers");
var logger = new Logger_1.ConsoleLogger('PubSub');
var PubSub = /** @class */ (function () {
    /**
     * Initialize PubSub with AWS configurations
     *
     * @param {PubSubOptions} options - Configuration object for PubSub
     */
    function PubSub(options) {
        this._options = options;
        logger.debug('PubSub Options', this._options);
        this._pluggables = [];
    }
    /**
     * Configure PubSub part with configurations
     *
     * @param {PubSubOptions} config - Configuration for PubSub
     * @return {Object} - The current configuration
     */
    PubSub.prototype.configure = function (options) {
        var _this = this;
        var opt = options ? options.PubSub || options : {};
        logger.debug('configure PubSub', { opt: opt });
        this._options = Object.assign({}, this._options, opt);
        if (this._options.aws_appsync_graphqlEndpoint && this._options.aws_appsync_region &&
            !this._pluggables.find(function (p) { return p.getProviderName() === 'AWSAppSyncProvider'; })) {
            this.addPluggable(new Providers_1.AWSAppSyncProvider());
        }
        this._pluggables.map(function (pluggable) { return pluggable.configure(_this._options); });
        return this._options;
    };
    /**
     * add plugin into Analytics category
     * @param {Object} pluggable - an instance of the plugin
     */
    PubSub.prototype.addPluggable = function (pluggable) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                if (pluggable) {
                    this._pluggables.push(pluggable);
                    config = pluggable.configure(this._options);
                    return [2 /*return*/, config];
                }
                return [2 /*return*/];
            });
        });
    };
    PubSub.prototype.publish = function (topics, msg, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._pluggables.map(function (provider) { return provider.publish(topics, msg, options); })];
            });
        });
    };
    PubSub.prototype.subscribe = function (topics, options) {
        var _this = this;
        logger.debug('subscribe options', options);
        return new Observable(function (observer) {
            var observables = _this._pluggables.map(function (provider) { return ({
                provider: provider,
                observable: provider.subscribe(topics, options),
            }); });
            var subscriptions = observables.map(function (_a) {
                var provider = _a.provider, observable = _a.observable;
                return observable.subscribe({
                    start: console.error,
                    next: function (value) { return observer.next({ provider: provider, value: value }); },
                    error: function (error) { return observer.error({ provider: provider, error: error }); },
                });
            });
            return function () { return subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); }); };
        });
    };
    return PubSub;
}());
exports.default = PubSub;
//# sourceMappingURL=PubSub.js.map