var bcrypt = require('bcrypt')
var Promise = require('bluebird')
var db = require('./database.js')
var logger = log4js.getLogger()

socket.on('newUser', function(data){
	checkUsernameOrEmailExists({username: data.username, email: data.email},(err,user,email,res) => {
		if(err){
			logger.error('error during checkUsernameOrEmailExists in socket newUser call: ' + err)
			socket.emit('signUpError',{message: 'Error creating user, please try again later'})  				
		} else if(user){
			socket.emit('signUpError',{message: 'Username exists, please use a different name'})
		} else if(email){
			socket.emit('signUpError',{message: 'Email exists, please use a different email'})
		} else {
		bcrypt.hash(data.password, saltRounds, (err, hashedPassword) => {
			if(err){
				logger.error('error during bcrypt.hash newPassword in socket newUser call: ' + err)
				socket.emit('signUpError',{message: 'Error creating user, please try again later'})
			} else {
				db.createUser(data.username,hashedPassword)
				.then(newUserId => {db.addToUserVerificationTable({userid: newUserId, email: data.email, verification_token: verification_token})})
				.then(generateVerificationEmail({username: data.username, verification_token: verification_token, email: data.email}))
				.then(email => {
					transporter.sendMail(email, (err,info) => {
						if (err) {
							logger.error(err);
						} else {
							socket.emit('signUpSuccess',{message: 'Account created successfully, please verify your email to complete registration'})
						}						
					})
				})
				.catch(exception => ){
					logger.error(exception)
					socket.emit('signUpError',{message: 'Error creating user, please try again later'})
				}
			}
		})	  				
		}
	})
});

// check db row for both existing email and/or username
function checkUsernameOrEmailExists(payload) {
	db.getUserByUsernameOrEmail(payload.username, payload.email)
	.then(rows => {
		async.detect(rows,(row, callback) => {
			if(row.username == payload.username || row.email == payload.email){
				return callback(null,!err)
			}
		},(err,result) => {
			if(err){
				return callback(err,null,null,null)
			} else if(result == payload.username){
				return callback(null,true,null,null)
			} else if (result == payload.email){
				return callback(null,null,true,null)
			} else {
				return callback(null,null,null,true)
			}
		})
	})
	.catch(exception => {
		logger.error(exception)
	})
}

// return formatted verification email object
function generateVerificationEmail(data) {
	var url = process.env.WEBSITE + 'verify/' + data.verification_token
	var formattedResponse = {
		from: 'no-reply@earthaline.com',
		to: data.email,
		subject: 'Email Verification',
		text: 'Hello ' + data.username + ',\n Please click on the following link to verify your email address: \n' + url,
		html: 'Hello Earthling. <br /><br /> <strong>' + data.username + '</strong>, please click on the link below to verify your email address: <br /><br /><a href='+url+'>' + url+'</a>'
	}
	return Promise.resolve(formattedResponse)
}