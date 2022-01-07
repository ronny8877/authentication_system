

export default function (app: any) {
app.use('/api/users/routes', require('../routes/user.routes'));
  app.use('/api/apps', require('../routes/app.routes'))
  app.use('/api/token', require('../routes/token.routes'));
  app.use('/api/plan', require('../routes/plan.routes'));
}
