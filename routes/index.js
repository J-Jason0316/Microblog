var express = require('express')
var crypto = require('crypto')
var User = require('../models/user')
var Post = require('../models/post')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
	Post.get(null,function(err,posts){
		if(err){
			posts=[]
		}
		res.render('index', { 
			title: '首页',
			posts: posts,
		})
	})
})
router.get('/u/:user',checkLogin)
router.get('/u/:user',function (req,res) {  
	User.get(req.params.user,function(err,user){
		if(!user){
			req.flash('error','用户不存在')
			res.redirect('/')
		}
		Post.get(user.name,function(err,posts){
			console.log(user.name)
			//console.log(posts)
            
            
			if(err){
				req.flash('error',err)
				return res.redirect('/')
			}
			res.render('user',{
				title: user.name,
				posts: posts,
			})
		})
	})
})

//用于发表微博
router.get('/post',checkLogin)
router.post('/post',function(req,res,next){
	var currentUser = req.session.user
	var post =new Post(currentUser.name,req.body.post)
	//存入数据库
	post.save(function(err){
		if(err){
			req.flash('error',err)
			return res.redirect('/')
		}
		req.flash('success','发表成功')
		res.redirect('/u/'+currentUser.name)
	})
})


/**
 * 注册接口
 */
router.get('/reg', checkNotLogin)
router.get('/reg',function (req,res) {  
	var regObj = {title:'用户注册'}
	res.render('reg',regObj)
})

router.post('/reg', checkNotLogin)
router.post('/reg',function (req,res) {  
	// var doRegObj = {}
	// res.render('doReg',doRegObj)
	//判断密码是否一致
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error','两次输入的密码不一致')
		return res.redirect('/reg')
	}
	//生成密码的散列值
	var md5 = crypto.createHash('md5')
	var password = md5.update(req.body.password).digest('base64')
	//拿到数据封装成一个新的用户对象模型
	var newUser = new User({
		name:req.body.username,
		password:password,
	})
    
	//检查用户名是否已经存在
	User.get(newUser.name,function (err,user) {  
		//判断用户是否存在
		if (user) {
			err='用户已经存在。'
			req.flash('error','用户已经存在。')
			return res.redirect('/reg')
		}
		//反馈错误
		if (err) {
			req.flash('error',err)
			return res.redirect('/reg')
		}
		//如果不存在就新增用户
		newUser.save(function (err) {  
			if (err) {
				req.flash('error','注册失败。')
				return res.redirect('/reg')
			}
			req.session.user = newUser
			req.flash('success','注册成功')
			res.redirect('/')
		})
	})
})

/**
 * 登入接口
 */
router.get('/login', checkNotLogin)
router.get('/login',function (req,res) {  
	var loginObj = {title:'用户登入'}
	res.render('login',loginObj)
})

router.post('/login', checkNotLogin)
router.post('/login',function(req,res,next){
	//对用户输入的密码进行处理
	var md5 = crypto.createHash('md5')
	var password = md5.update(req.body.password).digest('base64')
  
	User.get(req.body.username,function(err,user){
		//console.log(!user)
        
		if(!user){
			req.flash('error','用户不存在，您可以点击注册按钮进行注册！')
			return res.redirect('/login')
		}
		if(user.password!=password){
			req.flash('error','密码错误')
			return res.redirect('/login')
		}
		req.session.user = user
		req.flash('success','登入成功')
		return res.redirect('/')
	})
})
  


/**
 * 登出接口
 */
router.get('/logout', checkLogin)
router.get('/logout',function(req,res,next){
	req.session.user=null
	req.flash('success','登出成功')
	res.redirect('/')
})

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','用户未登录')
		return res.redirect('/login')
	}
	next()
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','用户已登录')
		return res.redirect('/')
	}
	next()
}



module.exports = router
