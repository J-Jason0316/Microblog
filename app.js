var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var settings = require('./settings')
var flash = require('connect-flash')
// var partials = require('express-partials')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// app.use(partials())//ejs中使用partials需要引入该模块
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		url: 'mongodb://localhost/microblog',
		//autoRemove: 'native'
	})
}))

app.use(flash())//使用flash要和下面这个函数连在一起  放在router前面
app.use(function(req,res,next){
	res.locals.user=req.session.user
  
	var err = req.flash('error')
	var success = req.flash('success')
    
	res.locals.post = req.session.post
	res.locals.error = err.length ? err : null
	res.locals.success = success.length ? success : null
     
	next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})



app.listen(3000,function () {  
	console.log('server started at port 3000')
})

module.exports = app
