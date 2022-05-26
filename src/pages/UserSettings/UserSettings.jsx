import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import './UserSettings.scss';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { infoNotification, errorNotification } from '../../components/Notifications/Notifications';
import ROLE from '../../utils/roles';

const UserSettings = (props) => {
	const selectedLanguage = useSelector((state) => state.language);
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
				setFirstNameError(LANGUAGE.register_modal_first_name_error[selectedLanguage]);
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
					showNotification(infoNotification(LANGUAGE.notification_settings_first_name[selectedLanguage]));
				} else {
					showNotification(errorNotification());
				}
			}
		}
		//lastName
		if (lastName !== loggedUser?.lastName) {
			if (lastName === '') {
				setLastNameError(LANGUAGE.register_modal_last_name_error[selectedLanguage]);
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
					showNotification(infoNotification(LANGUAGE.notification_settings_last_name[selectedLanguage]));
				} else {
					showNotification(errorNotification());
				}
			}
		}
		//password
		if (password !== '') {
			if (password.length < 8 && password.length > 0) {
				setPasswordError(LANGUAGE.register_modal_invalid_password_format[selectedLanguage]);
			}
			if (password !== confirmPassword) {
				setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error[selectedLanguage]);
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
					showNotification(infoNotification(LANGUAGE.notification_settings_password[selectedLanguage]));
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
					<h3 className='settings-head'>{LANGUAGE.settings_header[selectedLanguage]}</h3>
					<p className='settings-top-text'>
						{props.role === ROLE.USER && LANGUAGE.settings_top_text_user[selectedLanguage]}
					</p>
				</div>
			</div>
			<div className='settings-main-container'>
				<div className='settings-main'>
					<div className='settings-main-top'>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.register_modal_first_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_first_name[selectedLanguage]}
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
							label={LANGUAGE.register_modal_last_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_last_name[selectedLanguage]}
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
							label={LANGUAGE.settings_password_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_password_input[selectedLanguage]}
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
							label={LANGUAGE.settings_password_confirm_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_password_confirm_input[selectedLanguage]}
							value={confirmPassword}
							error={confirmPasswordError}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								setConfirmPasswordError(null);
							}}
						/>
					</div>

					<div className='footer'>
						<Button radius='xl' onClick={handleSave}>
							{LANGUAGE.settings_page_save[selectedLanguage]}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
