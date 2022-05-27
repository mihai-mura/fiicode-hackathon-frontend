import { Button, LoadingOverlay } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import './AllowAccess.scss';
import UserCard from '../../components/UserCard/UserCard';

const AllowAccess = () => {
	const dispatch = useDispatch();
	const [loadingOverlay, setLoadingOverlay] = useState(false);
	const [users, setUsers] = useState([]);

	//! get users

	return (
		<div className='page page-allow-access'>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='page-manage-users-header'>
				<Button
					className='add-user-button'
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'orange', to: 'red' }}
					onClick={() => {
						dispatch(changeModalState('createUser', true));
					}}>
					Add Member
				</Button>
				<Button
					className='add-user-button-mobile'
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'orange', to: 'red' }}
					onClick={() => dispatch(changeModalState('createUser', true))}>
					<IconPlus style={{ width: '30px', height: '30px' }} />
				</Button>
			</div>
			<div className='page-manage-users-body'>
				{users.map((user, index) => (
					<UserCard key={index} email={user.email} name={`${user.firstName} ${user.lastName}`} />
				))}
			</div>
		</div>
	);
};
export default AllowAccess;
