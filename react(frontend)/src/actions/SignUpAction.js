import { v4 } from 'node-uuid'
import { CHANGE_ISSIGNUPMODALVISIBLE, UPDATE_SIGNUP_PASSWORD, UPDATE_SIGNUP_EMAIL, UPDATE_SIGNUP_CONFIRMPASSWORD, UPDATE_SIGNUP_USERNAME, CHANGE_IS_SIGNUP_LOADING, UPDATE_ERROR_MESSAGE, RESET_SIGNUP_MODAL } from '../constants/actionTypes'

export const changeIsSignUpModalVisible = (isSignUpModalVisible) => {
	return {
		type: CHANGE_ISSIGNUPMODALVISIBLE,
		id: v4(),
		isSignUpModalVisible: isSignUpModalVisible
	}
}

export const updateUsername = (username) => {
	return {
		type: UPDATE_SIGNUP_USERNAME,
		id: v4(),
		username: username
	}
}

export const updatePassword = (password) => {
	return {
		type: UPDATE_SIGNUP_PASSWORD,
		id: v4(),
		password: password
	}
}

export const updateConfirmPassword = (confirmPassword) => {
	return {
		type: UPDATE_SIGNUP_CONFIRMPASSWORD,
		id: v4(),
		confirmPassword: confirmPassword
	}
}

export const updateEmail = (email) => {
	return {
		type: UPDATE_SIGNUP_EMAIL,
		id: v4(),
		email: email
	}
}

export const updateErrorMessage = (errorMessage) => {
	return {
		type: UPDATE_ERROR_MESSAGE,
		id: v4(),
		errorMessage: errorMessage
	}
}

export const changeIsSignUpLoading = (isSignUpLoading) => {
	return {
		type: CHANGE_IS_SIGNUP_LOADING,
		id: v4(),
		isSignUpLoading: isSignUpLoading
	}
}

export const resetSignUpModal = () => {
	return {
		type: RESET_SIGNUP_MODAL,
		id: v4()
	}
}