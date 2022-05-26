export const changeModalState = (type, payload) => ({
	type, //* type: login, register
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});

export const setLanguage = (payload) => {
	localStorage.setItem('language', payload);
	return {
		type: 'setLanguage',
		payload,
	};
};
