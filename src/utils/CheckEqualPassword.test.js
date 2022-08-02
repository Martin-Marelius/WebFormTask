const checkEqualPassword = require('./CheckEqualPassword')

test('Check if passwords are unique', () => {
    expect(checkEqualPassword("123", "123")).toBe(true);
    expect(checkEqualPassword("martin", "johnsen")).toBe(false);
    expect(checkEqualPassword(null, "")).toBe(false);
  })