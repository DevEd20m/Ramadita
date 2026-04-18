"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRouter = WebhookRouter;
const express_1 = require("express");
function WebhookRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/', controller.verifyWebhook);
    router.post('/', controller.handleMessage);
    return router;
}
