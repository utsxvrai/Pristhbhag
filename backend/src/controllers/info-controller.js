const {StatusCodes} = require('http-status-codes');

const info = (req, res) => {
  res.status(StatusCodes.OK).json({
    version: '1.0.0', 
    name: 'IShowSpeed API'
  });
}


module.exports = {
  getInfo: info,
};
