import { Button, Modal, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setSelectedChild } from '../../../redux/actions';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';

const EditChildModal = () => {
	const dispatch = useDispatch();

	const selectedChild = useSelector((store) => store.selectedChild);
	const modal = useSelector((store) => store.modals.editChild);

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState(false);

	const handleChangeName = async () => {
		if (name === '') {
			setNameError('Name is required');
		} else {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/children/${selectedChild}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: JSON.stringify({ name }),
			});
			if (res.status === 200) {
				dispatch(setSelectedChild(null));
				window.location.reload(false);
			} else showNotification(errorNotification());
		}
	};

	return (
		<Modal
			opened={modal}
			onClose={() => {
				dispatch(changeModalState('editChild', false));
				dispatch(setSelectedChild(null));
				setName('');
				setNameError(false);
			}}
			title='Edit Child'>
			<TextInput
				label='Child Name'
				variant='filled'
				value={name}
				onChange={(e) => {
					setName(e.target.value);
					setNameError(false);
				}}
				error={nameError}
				radius='xl'
				placeholder='Name'
			/>
			<div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
				<Button onClick={handleChangeName} color='orange' radius='xl'>
					Submit
				</Button>
			</div>
		</Modal>
	);
};
export default EditChildModal;
