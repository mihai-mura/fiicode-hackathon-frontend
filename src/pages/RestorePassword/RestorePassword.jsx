import './RestorePassword.scss';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PasswordInput, Paper, Button, LoadingOverlay } from '@mantine/core';
import { CgPassword } from 'react-icons/cg';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../components/Notifications/Notifications';
import { setLanguage } from '../../redux/actions';

const RestorePassword = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [linkExpired, setLinkExpired] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState(null);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	useEffect(() => {
		(async () => {
			//verifies if token expired
			const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password-valid`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${params.token}`,
				},
			});
			if (res.status === 401) setLinkExpired(true);
		})();
	}, [params.token]);
	const handleSubmit = async () => {
		//password format validation
		if (password.length < 8 && password.length > 0) {
			setPasswordError('Password must have at least 8 characters');
		}
		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
		}
		//empty fields validation
		if (password === '') {
			setPasswordError('Password is required');
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}
		if (password !== '' && confirmPassword !== '' && password.length >= 8 && password === confirmPassword) {
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${params.token}`,
					},
					body: JSON.stringify({
						password: password,
					}),
				});
				if (res.status === 200) {
					showNotification(infoNotification('Password changed', 'green', 'You can now login  with your new password'));
					navigate('/');
				}
			} catch (error) {
				console.error(error);
				showNotification(errorNotification());
			}
		}
	};

	const LinkInvalidPage = (
		<>
			<div>Link invalid</div>
		</>
	);

	const RestorePasswordPage = (
		<Paper className='paper' shadow='md' radius='lg' p='xl' withBorder>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='header'>
				<p>Set a new password</p>
			</div>
			<PasswordInput
				className='auth-input'
				icon={<CgPassword />}
				variant='filled'
				placeholder='Password'
				description='Password must be at leat 8  characters'
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
				placeholder='Confirm password'
				radius='md'
				value={confirmPassword}
				onChange={(e) => {
					setConfirmPassword(e.target.value);
					setConfirmPasswordError(false);
				}}
				error={confirmPasswordError}
			/>
			<Button variant='gradient' gradient={{ from: 'orange', to: 'red' }} radius='md' size='md' onClick={handleSubmit}>
				Submit
			</Button>
		</Paper>
	);

	return <div className='page-restore-password'>{linkExpired ? LinkInvalidPage : RestorePasswordPage}</div>;
};
export default RestorePassword;
