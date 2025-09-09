describe('Reservations', () => {
  const user = {
    email: 'gamotrick@gmail.com',
    password: 'test1234Test#',
  };

  beforeAll(async () => {
    await fetch('http://auth:3001', {
      method: 'POST',
      body: JSON.stringify(user),
    });


  });

  test('Create', () => {});
});
