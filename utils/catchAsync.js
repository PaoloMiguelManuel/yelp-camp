module.exports = func => {
   return (req, res, next) => {
      func(req, res, next).catch(next);
   }
}
// we are returning a function that accepts a function, it then executes that function.
// it catches any errors and passes it to "next"