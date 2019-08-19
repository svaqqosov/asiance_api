module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    new ApiResponse().send(res);
    return;
  }

  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'
  );
  res.header('Cache-Control', 'no-cache');
  next();
};
