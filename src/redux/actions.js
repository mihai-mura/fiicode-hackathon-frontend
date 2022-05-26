export const changeModalState = (type, payload) => ({
	type, //* type: login, register
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});

export const setLanguage = (payload) => ({
	type: 'setLanguage',
	payload,
});
