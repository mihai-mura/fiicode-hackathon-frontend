export const changeModalState = (type, payload) => ({
	type, //* type: login, register, addChild, createUser
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});
