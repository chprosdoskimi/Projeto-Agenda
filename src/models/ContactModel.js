const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  created_at: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function () {
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.validate = function () {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push('E-mail inválido');
  if (!this.body.name) this.errors.push('Nome é um campo obrigatório.');
  if (!this.body.email && !this.body.phone) {
    this.errors.push(
      'Pelo menos um contato precisa ser enviado: e-mail ou telefone.'
    );
  }
};

Contact.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    lastname: this.body.lastname,
    email: this.body.email,
    phone: this.body.phone,
  };
};

Contact.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

Contact.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos
Contact.searchId = async function (id) {
  if (typeof id !== 'string') return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContacts = async function () {
  const contacts = await ContactModel.find().sort({ created_at: -1 });
  return contacts;
};

Contact.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
};

module.exports = Contact;
