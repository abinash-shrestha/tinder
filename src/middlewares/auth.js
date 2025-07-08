const adminAuth = (req, res, next) => {
  const token = 'abc';
  const isAdminAuthorized = token === 'abc';
  console.log('Admin is being authorized');

  if (!isAdminAuthorized) {
    res.status(401).send('Authorized Request');
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = 'xyz';
  const isUserAuthorized = token === 'xyz';
  console.log('User is being Authorized');

  if (!isUserAuthorized) {
    res.status(401).send('Unauthorized Request');
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
