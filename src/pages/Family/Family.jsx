import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ChildCard from '../../components/ChildCard/ChildCard';
import { changeModalState } from '../../redux/actions';
import { errorNotification } from '../../components/Notifications/Notifications';
import './Family.scss';

const Family = () => {
	const dispatch = useDispatch();
	const [children, setChildren] = useState([]);

	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/children/all`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			if (res.status === 200) {
				const response = await res.json();
				setChildren(response);
			} else showNotification(errorNotification());
		})();
	}, []);

	return (
		<div className='page page-family'>
			<div className='header'>
				<Button
					variant='gradient'
					gradient={{ from: 'orange', to: 'red' }}
					radius='xl'
					onClick={() => dispatch(changeModalState('addChild', true))}>
					Add children
				</Button>
			</div>
			<div className='children-container'>
				{children.map((child) => (
					<ChildCard
						_id={child._id}
						deleteCard={() => setChildren((prev) => prev.filter((u) => u._id !== child._id))}
						name={child.name}></ChildCard>
				))}
			</div>
		</div>
	);
};
export default Family;
