import React from 'react';
import './ChildCard.scss';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';

const ChildCard = (props) => {
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
			<Button radius='lg' color='red' onClick={handleDeleteChild}>
				Delete
			</Button>
		</div>
	);
};

export default ChildCard;
