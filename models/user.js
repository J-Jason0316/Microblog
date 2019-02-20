var mongodb = require('./db')
var util = require('util')
console.log('数据库连接成功')


function User(user) {  
	this.name = user.name
	this.password = user.password
}
module.exports = User

/**
 * 数据库存储用户
 */

User.prototype.save = function (callback) {  
	//存入Mongodb文档
	var user = {
		name: this.name,
		password: this.password,
	}
	mongodb.open(function (err,db) {  
		//连接数据库
        
		if (err) {
			return callback(err)
		}
		//读取 users 集合
		db.collection('user',function (err,collection) {  
			if (err) {
				mongodb.close()
				return callback(err)
			}
			//为 name 属性添加引索
			collection.ensureIndex('name',{unique: true})
			//写入 user 文档
			collection.insert(user,{safe: true},function (err,user) {  
				mongodb.close()
				callback(err, user)
			})
		})
	})
}

/**
 * 从数据库获取用户
 */

User.get = function get(username, callback) {  
	mongodb.open(function (err, db) {  
		if (err) {
			return callback(err)
		}
		//读取 users 集合
		db.collection('user', function (err, collection) {  
			if (err) {
				mongodb.close()
				return callback(err)
			}
			//查找 name 属性为 username 的文档
			collection.findOne({name: username}, function (err, doc) {  
				mongodb.close()
				if (doc) {
					console.log('查看查询结果:\r\n'+util.inspect(doc))
					var user = new User(doc)
					callback(err, user)
				} else {
					callback(err, null)
				}
			})
		})
	})
}