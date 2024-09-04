const User = require('../models/userModel');

const ADMIN_NAME = 'henry';
const ADMIN_EMAIL = 'henry.ztilaks@acme.com';
const ADMIN_PASSWORD = 'sehorti0202';

module.exports = async () => {
  try {
    const existingUser = await User.findByEmail(ADMIN_EMAIL);
    if (existingUser) {
      return console.log('Admin user already exists');;
    }

    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, isAdmin: true });
    return console.log('Admin user created successfully');
  } catch (error) {
    return console.error('Error creating admin user, error details:', error);
  }
};
