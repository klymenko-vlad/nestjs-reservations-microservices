describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'gamotrick@gmail.com',
      password: 'test1234Test#',
    };

    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    jwt = await response.text();
  });

  test('Create & Get', async () => {
    const createdReservation = await createReservation();

    const responseGet = await fetch(
      `http://reservations:3000/reservations/${createdReservation._id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authentication: jwt },
      },
    );

    const reservation = await responseGet.json();

    expect(reservation).toEqual(createdReservation);
  });

  const createReservation = async () => {
    const responseCreate = await fetch(
      'http://reservations:3000/reservations',
      {
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
      },
    );

    expect(responseCreate.ok).toBeTruthy();
    return responseCreate.json();
  };
});
