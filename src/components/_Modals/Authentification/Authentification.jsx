import './Authentification.scss';
import { Modal, TextInput, Button, PasswordInput, LoadingOverlay, NativeSelect, SegmentedControl } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { changeModalState, setLoggedUser } from '../../../redux/actions';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';
import ROLE from '../../../utils/roles';

const Authentification = () => {
	const dispatch = useDispatch();
	const modals = useSelector((state) => state.modals);

	//register types
	const [registerType, setRegisterType] = useState('parent');

	//inputs
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	//errors
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [registerEmailError, setRegisterEmailError] = useState(false);
	const [loginEmailError, setLoginEmailError] = useState(false);
	const [registerPasswordError, setRegisterPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [loginPasswordError, setLoginPasswordError] = useState(false);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	//stop overlay
	useEffect(() => {
		if (!modals.login && !modals.register) {
			setLoadingOverlay(false);
		}
	}, [modals]);

	//handle enter key
	useEffect(() => {
		const listener = (event) => {
			if (event.code === 'Enter' || event.code === 'NumpadEnter') {
				event.preventDefault();
				if (modals.login) {
					handleLogin();
				} else if (modals.register) {
					handleRegister();
				}
			}
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		modals.login,
		modals.register,
		firstName,
		lastName,
		registerEmail,
		registerPassword,
		confirmPassword,
		loginEmail,
		loginPassword,
	]);

	const handleRegister = async () => {
		//email format verification
		if (registerEmail.indexOf('@') === -1 || registerEmail.lastIndexOf('.') < registerEmail.indexOf('@')) {
			setRegisterEmailError('Invalid email format');
		}
		//password format verification
		if (registerPassword.length < 8 && registerPassword.length > 0) {
			setRegisterPasswordError('Password has less than 8 characters');
		}
		if (registerPassword !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
		}
		//empty fields verification
		if (firstName === '') {
			setFirstNameError('First name is required');
		}
		if (lastName === '') {
			setLastNameError('Last name is required');
		}
		if (registerEmail === '') {
			setRegisterEmailError('Email is required');
		}
		if (registerPassword === '') {
			setRegisterPasswordError('Password is required');
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}

		if (
			firstName !== '' &&
			lastName !== '' &&
			registerEmail !== '' &&
			registerPassword !== '' &&
			confirmPassword !== '' &&
			registerEmail.indexOf('@') !== -1 &&
			registerEmail.lastIndexOf('.') > registerEmail.indexOf('@') &&
			registerPassword.length >= 8 &&
			registerPassword === confirmPassword
		) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: registerEmail,
						firstName: firstName,
						lastName: lastName,
						password: registerPassword,
					}),
				});
				if (res?.status === 201) {
					const response = await res.json();
					localStorage.setItem('api-token', response.token);
					dispatch(changeModalState('register', false));
					dispatch(setLoggedUser(response.user));
					setFirstName('');
					setLastName('');
					setRegisterEmail('');
					setRegisterPassword('');
					setConfirmPassword('');
					setLoadingOverlay(false);
				} else if (res.status === 409) {
					setLoadingOverlay(false);
					setRegisterEmailError('Email already in use');
				} else {
					showNotification(errorNotification());
				}
			} catch (error) {
				console.error(error);
				showNotification(errorNotification('Something went wrong', 'Please try again later'));
				setLoadingOverlay(false);
			}
		}
	};
	const handleLogin = async () => {
		//password format verification
		if (loginPassword.length < 8 && loginPassword.length > 0) {
			setLoginPasswordError('Password invalid');
		}
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError('Invalid email format');
		}
		//empty fields verification
		if (loginEmail === '') {
			setLoginEmailError('Email is required');
		}
		if (loginPassword === '') {
			setLoginPasswordError('Password required');
		}

		if (
			loginEmail !== '' &&
			loginPassword !== '' &&
			loginEmail.indexOf('@') !== -1 &&
			loginEmail.lastIndexOf('.') > loginEmail.indexOf('@') &&
			loginPassword.length >= 8
		) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: loginEmail,
						password: loginPassword,
					}),
				});
				if (res.status === 200) {
					const response = await res.json();
					localStorage.setItem('api-token', response.token);
					dispatch(changeModalState('login', false));
					dispatch(setLoggedUser(response.user));
					setLoginEmail('');
					setLoginPassword('');
				} else if (res.status === 403) {
					setLoadingOverlay(false);
					setLoginPasswordError('Wrong password');
				} else if (res.status === 404) {
					setLoadingOverlay(false);
					setLoginEmailError('User not found');
				}
			} catch (error) {
				console.error(error);
				showNotification(errorNotification('Something went wrong', 'Please try again later'));
				setLoadingOverlay(false);
			}
		}
	};

	const handleForgotPassword = async () => {
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError('Invalid email format');
		}
		if (loginEmail === '') {
			setLoginEmailError('Email is required');
		}
		if (loginEmail !== '' && loginEmail.indexOf('@') !== -1 && loginEmail.lastIndexOf('.') > loginEmail.indexOf('@')) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password-email`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: loginEmail,
					}),
				});
				if (res.status === 200) {
					showNotification(infoNotification('Email sent', 'green', 'Please check your email to reset your password'));
					setLoginEmail('');
					setLoadingOverlay(false);
				} else if (res.status === 404) {
					setLoadingOverlay(false);
					setLoginEmailError('User not found');
				}
			} catch (error) {
				console.error(error);
				showNotification(errorNotification('Something went wrong', 'Please try again later'));
				setLoadingOverlay(false);
			}
		}
	};

	const registerParent = (
		<div style={{ width: '100%', position: 'relative' }}>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='register-field-row'>
				<TextInput
					className='auth-input'
					icon={<CgRename />}
					variant='filled'
					placeholder='First name'
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
					placeholder='Last name'
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
					value={registerEmail}
					onChange={(e) => {
						setRegisterEmail(e.target.value);
						setRegisterEmailError(false);
					}}
					error={registerEmailError}
				/>
			</div>
			<PasswordInput
				className='auth-input'
				icon={<CgPassword />}
				variant='filled'
				placeholder='Your password'
				description='Password must be at least 8 characters long'
				radius='md'
				value={registerPassword}
				onChange={(e) => {
					setRegisterPassword(e.target.value);
					setRegisterPasswordError(false);
				}}
				error={registerPasswordError}
			/>
			<PasswordInput
				className='auth-input'
				icon={<CgPassword />}
				variant='filled'
				placeholder='Confirm password'
				radius='md'
				value={confirmPassword}
				onChange={(e) => {
					setConfirmPassword(e.target.value);
					setConfirmPasswordError(false);
				}}
				error={confirmPasswordError}
			/>

			<div className='auth-footer'>
				<div>
					<p>Already have an account?</p>
					<Button
						size='xs'
						variant='subtle'
						color='orange'
						radius='lg'
						compact
						onClick={() => {
							dispatch(changeModalState('login', true));
							dispatch(changeModalState('register', false));
							setFirstName('');
							setLastName('');
							setRegisterEmail('');
							setRegisterPassword('');
							setConfirmPassword('');
							setRegisterEmailError(false);
							setRegisterPasswordError(false);
							setConfirmPasswordError(false);
							setFirstNameError(false);
							setLastNameError(false);
						}}>
						Login here
					</Button>
				</div>
				<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='xl' onClick={handleRegister}>
					Register
				</Button>
			</div>
		</div>
	);

	const registerChild = (
		<div className='register-child'>
			<a href='http://localhost:3001' target='_blank'>
				Go to child app
			</a>
		</div>
	);

	return (
		<>
			<Modal
				centered
				opened={modals.login}
				onClose={() => {
					dispatch(changeModalState('login', false));
					setLoginEmail('');
					setLoginPassword('');
					setLoginEmailError(false);
					setLoginPasswordError(false);
				}}
				title='Login'>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loadingOverlay} />
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder='Your email'
						radius='md'
						value={loginEmail}
						onChange={(e) => {
							setLoginEmail(e.target.value);
							setLoginEmailError(false);
						}}
						error={loginEmailError}
					/>
					<PasswordInput
						className='auth-input'
						icon={<CgPassword />}
						variant='filled'
						placeholder='Your password'
						radius='md'
						value={loginPassword}
						onChange={(e) => {
							setLoginPassword(e.target.value);
							setLoginPasswordError(false);
						}}
						error={loginPasswordError}
					/>
					<Button variant='subtle' radius='lg' size='xs' color='orange' compact onClick={handleForgotPassword}>
						Forgot password?
					</Button>
					<div className='auth-footer'>
						<div>
							<p>Don't have an account?</p>
							<Button
								size='xs'
								variant='subtle'
								compact
								color='orange'
								radius='lg'
								onClick={() => {
									dispatch(changeModalState('register', true));
									dispatch(changeModalState('login', false));
									setLoginEmail('');
									setLoginPassword('');
									setLoginEmailError(false);
									setLoginPasswordError(false);
								}}>
								Register here
							</Button>
						</div>
						<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='xl' onClick={handleLogin}>
							Login
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				size='lg'
				centered
				opened={modals.register}
				onClose={() => {
					dispatch(changeModalState('register', false));
					setFirstName('');
					setLastName('');
					setRegisterEmail('');
					setRegisterPassword('');
					setConfirmPassword('');
					setRegisterEmailError(false);
					setRegisterPasswordError(false);
					setConfirmPasswordError(false);
					setFirstNameError(false);
					setLastNameError(false);
				}}
				title='Register'>
				<div className='auth-header'>
					<SegmentedControl
						radius='xl'
						value={registerType}
						onChange={setRegisterType}
						data={[
							{ label: 'Parent', value: 'parent' },
							{ label: 'Child', value: 'child' },
						]}
					/>
				</div>
				{registerType === 'parent' && registerParent}
				{registerType === 'child' && registerChild}
			</Modal>
		</>
	);
};
export default Authentification;
