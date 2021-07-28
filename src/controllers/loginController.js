const Login = require('../models/LoginModel');

exports.index = (request, response) => {
  if (request.session.user) return response.render('logged');
  return response.render('login');
};

exports.register = async function (request, response) {
  try {
    const login = new Login(request.body);
    await login.register();

    if (login.errors.length > 0) {
      request.flash('errors', login.errors);
      request.session.save(() => {
        return response.redirect('back');
      });
      return;
    }

    request.flash('success', 'Seu usuário foi criado com sucesso. ');
    request.session.save(() => {
      return response.redirect('back');
    });
  } catch (e) {
    console.log(e);
    return response.render('404');
  }
};

exports.login = async function (request, response) {
  try {
    const login = new Login(request.body);
    await login.login();

    if (login.errors.length > 0) {
      request.flash('errors', login.errors);
      request.session.save(() => {
        return response.redirect('back');
      });
      return;
    }

    request.flash('success', 'Você entrou no Sistema.');
    request.session.user = login.user;
    request.session.save(() => {
      return response.redirect('back');
    });
  } catch (e) {
    console.log(e);
    return response.render('404');
  }
};

exports.logout = function (request, response) {
  request.session.destroy();
  response.redirect('/index');
};
