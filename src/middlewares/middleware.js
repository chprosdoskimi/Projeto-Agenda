exports.middlewareGlobal = (request, response, next) => {
  response.locals.errors = request.flash('errors');
  response.locals.success = request.flash('success');
  response.locals.user = request.session.user;
  next();
};

exports.checkCsrfError = (err, request, response, next) => {
  if (err && 'EBADCSRFTOKEN' === err.code) {
    return response.render('404');
  }
};

exports.csrfMiddleware = (request, response, next) => {
  response.locals.csrfToken = request.csrfToken();
  next();
};

exports.loginRequired = (request, response, next) => {
  if (!request.session.user) {
    request.flash('errors', 'Você precisa fazer login.');
    request.session.save(() => response.redirect('/index'));
    return;
  }
  next();
};
