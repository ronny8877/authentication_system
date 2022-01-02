const sample = require("../routes/sample");

export default function (app: any) {
  app.use("/sample", sample);
app.use('/api/users/routes', require('../routes/user.routes'));
  app.use('/api/token', require('../routes/token.routes'));
}
