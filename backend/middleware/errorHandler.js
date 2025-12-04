export const errorHandler = (err, req, res, next) => {
   // console.log('Error stack:', err);

   const statusCode = err.statusCode || 500;
   const message = err.message || `Internal server error`;

   res.status(statusCode).json({
      status: err.staus || 'error',
      message,
   });
};
