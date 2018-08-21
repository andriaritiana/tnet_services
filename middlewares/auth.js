var auth = function(req, res, next) {
  console.log("Vous êtes authentifiés");
  next();
};


module.exports = auth;
