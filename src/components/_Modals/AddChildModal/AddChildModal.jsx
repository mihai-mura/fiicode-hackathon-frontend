import { Button, Modal, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../redux/actions';
import './AddChildModal.scss';
import socket from '../../../services/socketio';

const AddChildModal = () => {
	const dispatch = useDispatch();

	const loggedUser = useSelector((store) => store.loggedUser);
	const addChildModal = useSelector((store) => store.modals.addChild);
	const [qrData, setQrData] = useState('No result');
	const [page, setPage] = useState(1);
	const [firstName, setFirstName] = useState('');
	const [firstNameError, setFirstNameError] = useState(false);

	useEffect(() => {
		if (!addChildModal) {
		}
	}, [addChildModal]);

	useEffect(() => {
		(async () => {
			if (qrData !== 'No result' && loggedUser && firstName) {
				socket.emit('add-child', {
					parent: loggedUser?._id,
					childUuid: qrData,
					name: firstName,
				});
				dispatch(changeModalState('addChild', false));
				setFirstName('');
				setPage(1);
			}
		})();
	}, [firstName, loggedUser, qrData]);

	const handleNext = () => {
		if (firstName !== '') {
			setPage(2);
		} else setFirstNameError('A name is required');
	};

	const page1 = (
		<>
			<TextInput
				value={firstName}
				onChange={(event) => {
					setFirstName(event.target.value);
					setFirstNameError(false);
				}}
				error={firstNameError}
				placeholder='Name'
				label="Child's Name"
				radius='xl'
			/>
			<div className='footer'>
				<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='xl' onClick={handleNext}>
					Next
				</Button>
			</div>
		</>
	);

	const page2 = (
		<QrReader
			constraints={{
				facingMode: 'environment',
			}}
			onResult={(result, error) => {
				if (result) {
					setQrData(result?.text);
				}

				if (error) {
					console.info(error);
				}
			}}
			style={{ width: '100%' }}
		/>
	);

	return (
		<Modal
			className='add-child-modal'
			opened={addChildModal}
			onClose={() => {
				dispatch(changeModalState('addChild', false));
				setFirstName('');
				setFirstNameError(false);
				setPage(1);
			}}
			title='Add Child'>
			{addChildModal && (page === 1 ? page1 : page2)}
		</Modal>
	);
};
export default AddChildModal;
