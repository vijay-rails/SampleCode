

module.exports = {
	getUserByUsernameOrEmail: (username, email) => {
		return new Promise((resolve,reject) => {
			pool.getConnection(function (err, connection){
				if(err){
					return reject(err)
				} else {
					// Properly escaped query values
					connection.query("select id, email, username FROM users where username = ? OR email = ?",[username, email], function(err,result){
						if(err){
							return reject(err)
						} else {
							return resolve(result)
						}
					})
				}
			})		
		})
	},

	createUser: (username, password) => {
		return new Promise( (resolve,reject) => {
			pool.getConnection(function (err,connection){
				if(err){
					return reject(err)
				} 
				else {
					const user = {
						username: username,
						password: password
					}
					connection.query("INSERT INTO users SET ?",user, (err, result) => {
						if(err){
							return reject(err)
						} 
						else {
							return resolve(result.insertId)
						}
					})
				}
			})			
		})
	},

	addToUserVerificationTable: (data) => {
		return new Promise( (resolve,reject) => {
			pool.getConnection(function (err,connection){
				if(err){
					return reject(err)
				} else {
					connection.query("INSERT INTO user_verification SET ?",data, function(err, result){
						if(err){
							return reject(err)
						} else {
							return resolve(result)
						}
					})
				}
			})		
		})
	},
}