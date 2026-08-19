const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  let statusCode = err.status || 500;
  let message = err.message || 'Internal server error';
  
  if (statusCode === 401) {
    message = 'Authentication failed. Please check your API key.';
  } else if (statusCode === 403) {
    message = 'Access denied. This feature may require a higher plan.';
  } else if (statusCode === 429) {
    message = 'Too many requests. Please wait and try again.';
  } else if (statusCode === 500 || statusCode === 503) {
    message = 'Weather service is temporarily unavailable. Please try again later.';
  }
  
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected error occurred. Please try again later.';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.data
    })
  });
};

module.exports = errorHandler;
