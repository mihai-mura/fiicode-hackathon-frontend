import { combineReducers } from 'redux';

const modals = (state = { login: false, register: false, addChild: false, createUser: false }, action) => {
	switch (action.type) {
		case 'login':
			return { ...state, login: action.payload };
		case 'register':
			return { ...state, register: action.payload };
		case 'addChild':
			return { ...state, addChild: action.payload };
		case 'createUser':
			return { ...state, createUser: action.payload };
		default:
			return state;
	}
};

const loggedUser = (state = null, action) => {
	switch (action.type) {
		case 'setLoggedUser':
			return action.payload;
		default:
			return state;
	}
};

const Masterducer = combineReducers({
	modals,
	loggedUser,
});

export default Masterducer;
