import { useSelector } from 'react-redux';
import './UserSettings.scss';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { infoNotification, errorNotification } from '../../components/Notifications/Notifications';
import ROLE from '../../utils/roles';

const UserSettings = (props) => {
	const loggedUser = useSelector((state) => state.loggedUser);

	//fields
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	//field errors
	const [firstNameError, setFirstNameError] = useState(null);
	const [lastNameError, setLastNameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState(null);

	//set users settings in fields
	useEffect(() => {
		setFirstName(loggedUser?.firstName);
		setLastName(loggedUser?.lastName);
	}, [loggedUser]);

	const handleSave = async () => {
		//firstName
		if (firstName !== loggedUser?.firstName) {
			if (firstName === '') {
				setFirstNameError('First name is required');
			} else {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/first-name`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: firstName }),
				});
				if (res.status === 200) {
					setFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
					showNotification(infoNotification('First name saved'));
				} else {
					showNotification(errorNotification());
				}
			}
		}
		//lastName
		if (lastName !== loggedUser?.lastName) {
			if (lastName === '') {
				setLastNameError('Last name is required');
			} else {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/last-name`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: lastName }),
				});
				if (res.status === 200) {
					setLastName(lastName.charAt(0).toUpperCase() + lastName.slice(1));
					showNotification(infoNotification('Last name saved'));
				} else {
					showNotification(errorNotification());
				}
			}
		}
		//password
		if (password !== '') {
			if (password.length < 8 && password.length > 0) {
				setPasswordError('Password has less than 8 characters');
			}
			if (password !== confirmPassword) {
				setConfirmPasswordError('Passwords do not match');
			}
			if (password !== '' && confirmPassword !== '' && password.length >= 8 && password === confirmPassword) {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/password`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: password }),
				});
				if (res.status === 200) {
					setPassword('');
					setConfirmPassword('');
					showNotification(infoNotification('Password saved'));
				} else {
					showNotification(errorNotification());
				}
			}
		}
	};

	return (
		<div className='settings-page'>
			<div className='settings-top-container'>
				<div className='settings-top'>
					<h3 className='settings-head'>Settings</h3>
				</div>
			</div>
			<div className='settings-main-container'>
				<div className='settings-main'>
					<div className='settings-main-top'>
						<TextInput
							className='settings-text-input'
							radius='md'
							label='First name'
							placeholder='First name'
							value={firstName}
							error={firstNameError}
							onChange={(e) => {
								setFirstName(e.target.value);
								setFirstNameError(null);
							}}
						/>
						<TextInput
							className='settings-text-input'
							radius='md'
							label='Last name'
							placeholder='Last name'
							value={lastName}
							error={lastNameError}
							onChange={(e) => {
								setLastName(e.target.value);
								setLastNameError(null);
							}}
						/>
					</div>
					<div className='settings-main-middle'>
						<PasswordInput
							className='settings-text-input'
							radius='md'
							label='Password'
							placeholder='Password'
							value={password}
							error={passwordError}
							onChange={(e) => {
								setPassword(e.target.value);
								setPasswordError(null);
							}}
						/>
						<PasswordInput
							className='settings-text-input'
							radius='md'
							label='Confirm password'
							placeholder='Confirm password'
							value={confirmPassword}
							error={confirmPasswordError}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								setConfirmPasswordError(null);
							}}
						/>
					</div>

					<div className='footer'>
						<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='xl' onClick={handleSave}>
							Save
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
