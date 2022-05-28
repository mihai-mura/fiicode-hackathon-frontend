import './CreateUserModal.scss';
import { Button, LoadingOverlay, Modal, NativeSelect, PasswordInput, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../redux/actions';
import { CgRename, CgPassword } from 'react-icons/cg';
import { MdAlternateEmail } from 'react-icons/md';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';

const CreateUserModal = () => {
	const dispatch = useDispatch();
	const CreateUserModal = useSelector((state) => state.modals.createUser);
	const loggedUser = useSelector((store) => store.loggedUser);

	//inputs
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	//errors
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	const handleCreateAdmin = async () => {
		//email format verification
		if (email.indexOf('@') === -1 || email.lastIndexOf('.') < email.indexOf('@')) {
			setEmailError('Invalid email format');
		}
		//password format verification
		if (password.length < 8 && password.length > 0) {
			setPasswordError('Password has less than 8 characters');
		}
		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
		}
		//empty fields verification

		if (firstName === '') {
			setFirstNameError('First name is required');
		}
		if (lastName === '') {
			setLastNameError('Last name is required');
		}
		if (email === '') {
			setEmailError('Email is required');
		}
		if (password === '') {
			setPasswordError('Password is required');
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}

		if (
			firstName !== '' &&
			lastName !== '' &&
			email !== '' &&
			password !== '' &&
			confirmPassword !== '' &&
			email.indexOf('@') !== -1 &&
			email.lastIndexOf('.') > email.indexOf('@') &&
			password.length >= 8 &&
			password === confirmPassword
		) {
			//togle overlay
			setLoadingOverlay(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/users/member/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password,
					parent: loggedUser._id,
				}),
			});
			if (res.status === 201) {
				dispatch(changeModalState('createUser', false));
				setLoadingOverlay(false);
				setFirstName('');
				setLastName('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setEmailError(false);
				setPasswordError(false);
				setConfirmPasswordError(false);
				setFirstNameError(false);
				setLastNameError(false);
				showNotification(infoNotification('Added member'));
				setTimeout(() => window.location.reload(false), 1000);
			} else if (res.status === 409) {
				setEmailError('Email already in use');
				setLoadingOverlay(false);
			} else {
				showNotification(errorNotification());
				setLoadingOverlay(false);
			}
		}
	};

	return (
		<Modal
			size='lg'
			centered
			opened={CreateUserModal}
			onClose={() => {
				dispatch(changeModalState('createUser', false));
				setFirstName('');
				setLastName('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setEmailError(false);
				setPasswordError(false);
				setConfirmPasswordError(false);
				setFirstNameError(false);
				setLastNameError(false);
				setLoadingOverlay(false);
			}}
			title='Add member'>
			<div style={{ width: '100%', position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlay} />
				<div className='register-field-row'>
					<TextInput
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder='First Name'
						radius='md'
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							setFirstNameError(false);
						}}
						error={firstNameError}
					/>
					<TextInput
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder='Last Name'
						radius='md'
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							setLastNameError(false);
						}}
						error={lastNameError}
					/>
				</div>
				<div className='register-field-row'>
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder='Email'
						radius='md'
						type={'email'}
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(false);
						}}
						error={emailError}
					/>
				</div>
				<PasswordInput
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Password'
					description='Password should have at least 8 characters'
					radius='md'
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setPasswordError(false);
					}}
					error={passwordError}
				/>
				<PasswordInput
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Confirm Password'
					radius='md'
					value={confirmPassword}
					onChange={(e) => {
						setConfirmPassword(e.target.value);
						setConfirmPasswordError(false);
					}}
					error={confirmPasswordError}
				/>

				<div className='add-member-footer'>
					<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='xl' onClick={handleCreateAdmin}>
						Submit
					</Button>
				</div>
			</div>
		</Modal>
	);
};
export default CreateUserModal;
