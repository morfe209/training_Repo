function errorHandler(error, req, res, next){
  return res.status(error.state || 500).json({
    error:{
      message: error.message || "Ooops!! Something went wrong."
    }
  });
}   

module.exports = errorHandler;