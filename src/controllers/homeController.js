const contact = require('../models/ContactModel');

exports.index = async (request, response) => {
  const contacts = await contact.searchContacts();
  response.render('index', { contacts });
};
