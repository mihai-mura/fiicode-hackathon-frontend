export const changeModalState = (type, payload) => ({
	type, //* type: login, register, addChild
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});
