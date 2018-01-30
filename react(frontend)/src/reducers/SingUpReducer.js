import { CHANGE_ISSIGNUPMODALVISIBLE, UPDATE_SIGNUP_PASSWORD, UPDATE_SIGNUP_EMAIL, UPDATE_SIGNUP_CONFIRMPASSWORD, UPDATE_SIGNUP_USERNAME, CHANGE_IS_SIGNUP_LOADING, UPDATE_ERROR_MESSAGE, RESET_SIGNUP_MODAL } from '../constants/actionTypes'

const initialState = {
	isSignUpModalVisible: false,
	username: '',
	password: '',
	confirmPassword: '',
	email: '',
	isSignUpLoading: false,
	errorMessage: ''
}

const SignUpReducer = (state = initialState, action) => {
	switch (action.type) {
	case CHANGE_ISSIGNUPMODALVISIBLE:
		return Object.assign({}, state, {
			isSignUpModalVisible: action.isSignUpModalVisible
		})
	case UPDATE_SIGNUP_USERNAME:
		return Object.assign({}, state, {
			username: action.username
		})
	case UPDATE_SIGNUP_PASSWORD:
		return Object.assign({}, state, {
			password: action.password
		})
	case UPDATE_SIGNUP_CONFIRMPASSWORD:
		return Object.assign({}, state, {
			confirmPassword: action.confirmPassword
		})
	case UPDATE_SIGNUP_EMAIL:
		return Object.assign({}, state, {
			email: action.email
		})
	case UPDATE_ERROR_MESSAGE:
		return Object.assign({}, state, {
			errorMessage: action.errorMessage
		})
	case CHANGE_IS_SIGNUP_LOADING:
		return Object.assign({}, state, {
			isSignUpLoading: action.isSignUpLoading
		})
	case RESET_SIGNUP_MODAL:
		state = initialState
		return state
	default:
		return state
	}
}

export default SignUpReducer