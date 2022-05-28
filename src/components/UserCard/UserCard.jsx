import './UserCard.scss';
import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';
import { useClipboard } from '@mantine/hooks';

const UserCard = (props) => {
	const modals = useModals();
	const clipboardEmail = useClipboard({ timeout: 500 });

	const handleDeleteUser = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/users/members/${props._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification('Member deleted'));
			setTimeout(() => window.location.reload(false), 1000);
		} else {
			showNotification(errorNotification());
		}
	};

	const openDeleteUserModal = () =>
		modals.openConfirmModal({
			title: 'Delete member',

			children: (
				<>
					<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<p size='md'>{props.name}</p>
						</div>
					</div>
				</>
			),
			labels: {
				confirm: 'Delete',
				cancel: 'Cancel',
			},
			confirmProps: { color: 'red' },
			onConfirm: handleDeleteUser,
		});

	return (
		<div className='user-card'>
			<div className='header'>
				<p className='name'>{`${props.name}`}</p>
			</div>
			<p
				className='email'
				onClick={() => {
					clipboardEmail.copy(props.email);
					showNotification(infoNotification('Email copied!'));
				}}>
				Email: <span style={{ color: clipboardEmail.copied ? '#0ca678' : '#949699' }}>{props.email}</span>
			</p>

			<div className='footer'>
				<Button color='red' radius='xl' onClick={openDeleteUserModal}>
					Delete member
				</Button>
			</div>
		</div>
	);
};
export default UserCard;
