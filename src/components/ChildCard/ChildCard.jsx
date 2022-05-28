import React from 'react';
import './ChildCard.scss';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';
import { changeModalState, setSelectedChild } from '../../redux/actions';
import { useDispatch } from 'react-redux';

const ChildCard = (props) => {
	const dispatch = useDispatch();

	const handleDeleteChild = async () => {
		props.deleteCard();
		const res = await fetch(`${process.env.REACT_APP_API_URL}/children/${props._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status !== 200) showNotification(errorNotification());
	};

	return (
		<div className='child-card'>
			<p>{props.name}</p>
			<div className='buttons'>
				<Button
					radius='lg'
					color='yello'
					onClick={() => {
						dispatch(changeModalState('editChild', true));
						dispatch(setSelectedChild(props._id));
					}}>
					Edit
				</Button>
				<Button radius='lg' color='red' onClick={handleDeleteChild}>
					Delete
				</Button>
			</div>
		</div>
	);
};

export default ChildCard;
