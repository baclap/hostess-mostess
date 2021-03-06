"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../../Common");
var logger = new Common_1.ConsoleLogger('AbstractPubSubProvider');
var AbstractPubSubProvider = /** @class */ (function () {
    function AbstractPubSubProvider(options) {
        if (options === void 0) { options = {}; }
        this._config = options;
    }
    AbstractPubSubProvider.prototype.configure = function (config) {
        if (config === void 0) { config = {}; }
        this._config = __assign({}, config, this._config);
        logger.debug("configure " + this.getProviderName(), this._config);
        return this.options;
    };
    AbstractPubSubProvider.prototype.getCategory = function () { return 'PubSub'; };
    Object.defineProperty(AbstractPubSubProvider.prototype, "options", {
        get: function () { return __assign({}, this._config); },
        enumerable: true,
        configurable: true
    });
    return AbstractPubSubProvider;
}());
exports.AbstractPubSubProvider = AbstractPubSubProvider;
//# sourceMappingURL=PubSubProvider.js.map