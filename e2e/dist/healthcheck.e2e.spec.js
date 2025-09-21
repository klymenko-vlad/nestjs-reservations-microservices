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
const tcp_ping_1 = require("tcp-ping");
describe('Health', () => {
    test('Reservations', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('http://reservations:3000');
        expect(response.ok).toBeTruthy();
    }));
    test('Auth', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('http://auth:3001');
        expect(response.ok).toBeTruthy();
    }));
    test('Payments', (done) => {
        (0, tcp_ping_1.ping)({ address: 'payments', port: 3003 }, (err) => {
            if (err) {
                fail();
            }
            done();
        });
    });
    test('Notifications', (done) => {
        (0, tcp_ping_1.ping)({ address: 'notifications', port: 3004 }, (err) => {
            if (err) {
                fail();
            }
            done();
        });
    });
});
//# sourceMappingURL=healthcheck.e2e.spec.js.map