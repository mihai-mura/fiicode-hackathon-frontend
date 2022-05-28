export const changeModalState = (type, payload) => ({
	type, //* type: login, register, addChild, createUser, editChild
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});

export const setSelectedChild = (payload) => ({
	type: 'setSelectedChild',
	payload,
});
