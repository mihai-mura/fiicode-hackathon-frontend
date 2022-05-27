import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../redux/actions';

const RouteHandler = ({ children, logged }) => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((store) => store.loggedUser);

	const [content, setContent] = useState(children);

	const AccessDenied = (
		<div className='page' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
			Access Denied
		</div>
	);

	useEffect(() => {
		if (logged && !localStorage.getItem('api-token') && !loggedUser) {
			setContent(AccessDenied);
			dispatch(changeModalState('login', true));
		} else {
			dispatch(changeModalState('login', false));
			setContent(children);
		}
	}, [children, dispatch, logged, loggedUser]);

	return content;
};
export default RouteHandler;
