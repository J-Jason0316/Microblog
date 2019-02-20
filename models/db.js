// var settings = require('../settings')
// var Db = require('mongodb').Db
// var Connection = require('mongodb').Connection
// var Server = require('mongodb').Server
// var MongoClient = require('mongodb').MongoClient
// var DB_CONN_STR = 'mongodb://localhost:27017/runoob'

//module.exports = new Db(settings.db, new Server(settings.host, '127.0.0.1:27017', {}))

/*************************************************************************************************** */

// var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://localhost:27017/microblog'
// var Db = null
 
// MongoClient.connect(url, function(err, db) {
// 	if (err) throw err
// 	console.log('数据库已创建!')
// 	Db = db
// })

// module.exports = Db

/************************************************************** */
// var MongoClient=require('mongodb').MongoClient  
// var	Server=require('mongodb').Server
// var client=new MongoClient(new Server('localhost',27017,{
// 	socketOptions:{connectTimeoutMS:500},
// 	poolSize:5,
// 	auto_reconnect:true
// },{
// 	numberOfRetries:3,
// 	retryMiliSeconds:500
// }))
// module.exports = client

/************************************************ */
var settings = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server
module.exports = new Db(settings.db, new Server(settings.host, 27017, {}), {safe: true})
