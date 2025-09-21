var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
describe('Reservations', () => {
    let jwt;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        const user = {
            email: 'gamotrick@gmail.com',
            password: 'test1234Test#',
        };
        yield fetch('http://auth:3001/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
        });
        const response = yield fetch('http://auth:3001/auth/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
        });
        jwt = yield response.text();
    }));
    test('Create & Get', () => __awaiter(this, void 0, void 0, function* () {
        const createdReservation = yield createReservation();
        const responseGet = yield fetch(`http://reservations:3000/reservations/${createdReservation._id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authentication: jwt },
        });
        const reservation = yield responseGet.json();
        expect(reservation).toEqual(createdReservation);
    }));
    const createReservation = () => __awaiter(this, void 0, void 0, function* () {
        const responseCreate = yield fetch('http://reservations:3000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authentication: jwt },
            body: JSON.stringify({
                startDate: '02-01-2023',
                endDate: '02-03-2023',
                charge: {
                    amount: 12343,
                    card: {
                        cvc: '413',
                        exp_month: 12,
                        exp_year: 2027,
                        number: '4242 4242 4242 4242',
                    },
                },
            }),
        });
        expect(responseCreate.ok).toBeTruthy();
        return responseCreate.json();
    });
});
//# sourceMappingURL=reservations.e2e.spec.js.map