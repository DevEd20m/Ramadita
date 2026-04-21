"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const logger_1 = require("../utils/logger");
class WebhookController {
    verifyToken;
    processMessageUseCase;
    constructor(verifyToken, processMessageUseCase) {
        this.verifyToken = verifyToken;
        this.processMessageUseCase = processMessageUseCase;
    }
    verifyWebhook = (req, res) => {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode === 'subscribe' && token === this.verifyToken) {
            res.status(200).send(challenge);
        }
        else {
            logger_1.logger.warn('Rejected webhook verification request', {
                mode,
                tokenMatches: token === this.verifyToken,
            });
            res.sendStatus(403);
        }
    };
    handleMessage = (req, res) => {
        // Immediate 200 OK
        res.sendStatus(200);
        const requestContext = {
            method: req.method,
            path: req.path,
            requestId: req.get('x-request-id'),
            traceContext: req.get('x-cloud-trace-context'),
        };
        // Deferred background work
        try {
            const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (!message) {
                logger_1.logger.info('Webhook payload did not contain a message', requestContext);
                return;
            }
            if (message.type !== 'text' || typeof message.text?.body !== 'string') {
                logger_1.logger.warn('Skipping non-text webhook message', {
                    ...requestContext,
                    messageType: message.type,
                    from: message.from,
                });
                return;
            }
            const phoneNumber = message.from;
            const msgBody = message.text.body;
            if (!phoneNumber) {
                logger_1.logger.warn('Webhook message missing sender phone number', {
                    ...requestContext,
                });
                return;
            }
            void this.processMessageUseCase.execute(phoneNumber, msgBody).catch((error) => {
                logger_1.logger.error('Failed to process webhook message', error, {
                    ...requestContext,
                    phoneNumber,
                    messageType: message.type,
                });
            });
        }
        catch (error) {
            logger_1.logger.error('Error handling webhook payload', error, requestContext);
        }
    };
}
exports.WebhookController = WebhookController;
