import { connect } from 'react-redux'
import SignUp from '../components/SignUp'
import { changeIsSignUpModalVisible, updateUsername, updatePassword, updateConfirmPassword, updateEmail, changeIsSignUpLoading, updateErrorMessage, resetSignUpModal } from '../actions/SignUpAction'

const mapStateToProps = (state) => {
	return {
		signup: state.signup
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeIsSignUpModalVisible: (IsSignUpModalVisible) => {
			dispatch(changeIsSignUpModalVisible(!IsSignUpModalVisible))
		},
		updateUsername: (element) => {
			dispatch(updateUsername(element.target.value))
			dispatch(updateErrorMessage(''))
		},
		updatePassword: (element) => {
			dispatch(updatePassword(element.target.value))
		},
		updateConfirmPassword: (element) => {
			dispatch(updateConfirmPassword(element.target.value))
		},
		updateEmail: (element) => {
			dispatch(updateEmail(element.target.value))
			dispatch(updateErrorMessage(''))
		},
		updateErrorMessage: (errorMessage) => {
			dispatch(updateErrorMessage(errorMessage))
		},
		changeIsSignUpLoading: (isSignUpLoading) => {
			dispatch(changeIsSignUpLoading(isSignUpLoading))
		},
		resetSignUpModal: () => {
			dispatch(resetSignUpModal())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)