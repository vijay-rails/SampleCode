import React, { Component, PropTypes } from 'react'
import { Button, Modal, FormGroup, FormControl, ControlLabel, Col, HelpBlock } from 'react-bootstrap'
import { isEmailValid, isPasswordValid } from '../util/Validation'
import ReCAPTCHA from 'react-google-recaptcha'
import Alert from 'react-s-alert'
import FormControlWithText from './extended/FormControlWithText'

let captcha, someText, socket, that

class SignUp extends Component {
	constructor (props) {
		super(props)

		that = this

		this.handleSubmit = this.handleSubmit.bind(this)
		this.changeModal = this.changeModal.bind(this)
	}

	handleSubmit (event) {
		event.preventDefault()
		if (!isEmailValid(this.props.signup.email)) {
			console.log('email not valid')
		} else if (!isPasswordValid(this.props.signup.password, this.props.signup.confirmPassword)) {
			Alert.error('Passwords do not match')
		} else if (captcha.getValue()) {
			this.props.changeIsSignUpLoading(true)
			socket.emit('newUser', {username: this.props.signup.username, password: this.props.signup.password, email: this.props.signup.email})
		}
	}

	changeModal () {
		this.props.changeIsSignUpModalVisible(this.props.signup.isSignUpModalVisible)
		this.props.resetSignUpModal()
	}

	getEmailValidationState () {
		if (isEmailValid(this.props.signup.email)) {
			return 'success'
		} else {
			return 'error'
		}
	}

	getPasswordValidationState () {
		if (isPasswordValid(this.props.signup.password, this.props.signup.confirmPassword)) {
			return 'success'
		} else {
			return 'error'
		}
	}

	captchaValidatedForm (value) {
		console.log('capatcha return: ' + value)
	}

	componentWillMount () {
		socket = this.context.socket

		socket.on('signUpError', function (res) {
			that.props.updateErrorMessage(res.message)
			that.props.changeIsSignUpLoading(that.props.isSignUpLoading)
		})

		socket.on('signUpSuccess', function (res) {
			that.props.resetSignUpModal()
			Alert.success('Account created successfully, please verify your email to complete registration')
		})
	}

	render () {
		let isSignUpLoading = this.props.signup.isSignUpLoading
		return (
			<div>
			<Modal show={this.props.signup.isSignUpModalVisible} bsSize="small">
				<form onSubmit={this.handleSubmit}>
				<Modal.Header closeButton onClick={this.changeModal}>
					<Modal.Title>Sign Up</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<FormGroup>
						<Col className="text-center">
							<ControlLabel>Username</ControlLabel>
							<FormControl type="text" placeholder="this will be your display name" onChange={this.props.updateUsername} value={this.props.signup.username} required/>
						</Col>
					</FormGroup>

					<FormGroup validationState={this.getEmailValidationState()}>
					<Col className="text-center">
						<ControlLabel>Email</ControlLabel>
						<FormControl type="text" onChange={this.props.updateEmail} value={this.props.signup.email} required/>
						<FormControl.Feedback />
					</Col>
					</FormGroup>

					<FormGroup>
					<Col className="text-center">
						<ControlLabel>Password</ControlLabel>
						<FormControl type="password" onChange={this.props.updatePassword} value={this.props.signup.password} required/>
					</Col>
					</FormGroup>

					<FormGroup validationState={this.getPasswordValidationState()}>
					<Col className="text-center">
						<ControlLabel>Confirm Password</ControlLabel>
						<FormControl type="password" onChange={this.props.updateConfirmPassword} value={this.props.signup.confirmPassword} required/>
						<FormControl.Feedback />
					</Col>
					</FormGroup>
				</Modal.Body>

				<Modal.Footer>
				<ReCAPTCHA
					ref={(el) => { captcha = el }}
					size='normal'
					sitekey='6LeEPR8UAAAAAC3RqlAUcRzqvGllhUOfrA8HnkyD'
					onChange={this.captchaValidatedForm}
				/>
					{isSignUpLoading ? <Col className="text-center"><i className='fa fa-refresh fa-spin fa-3x'></i></Col> : <Button type="submit" bsStyle="primary" block>Sign Up</Button>}
					<Col className="text-center">
						<p style={{color: 'red'}}>{this.props.signup.errorMessage}</p>
					</Col>
				</Modal.Footer>

				</form>
			</Modal>
			</div>
		)
	}

}

export default SignUp

SignUp.contextTypes = {
	socket: PropTypes.object.isRequired
}
