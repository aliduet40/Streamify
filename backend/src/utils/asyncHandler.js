// const asyncHandler = ()=>{}

// const asyncHandler =(funct)=> {()=>{}}

// const asyncHandler = (requestHandler) => async() => {}

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     return await requestHandler(req, res, next);
//   } catch (error) {
//     return next(error);
//     // res.status(error.code || 500);
//     // res.json({
//     //   success: false,
//     //   message: error.message,
//     // });
//   }
// };

// export { asyncHandler }; // named export when import asyncHandler use same name inside as {asyncHandler}

// const asyncHandler = (requestHandler)=>{
//         (req , res , next)=>{
//             Promise.resolve(requestHandler(req , res ,next ))
//             Promise.reject((error)=> next(error))
//         }
// }

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
