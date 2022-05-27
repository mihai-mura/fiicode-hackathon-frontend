import React from 'react';
import './Navbar.scss';
import Logo from '../../images/trackme-black.png';
import MobileHamburger from '../../images/mobile-hamburger.svg';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setLoggedUser } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleMobileMenu }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const loggedUser = useSelector((state) => state.loggedUser);

	const userNotLoggedIcons = (
		<>
			<Button
				className='log-in-button'
				variant='gradient'
				gradient={{ from: 'orange', to: 'red' }}
				onClick={() => dispatch(changeModalState('login', true))}>
				Log in
			</Button>
			<Button
				className='sign-up-button'
				variant='gradient'
				gradient={{ from: 'orange', to: 'red' }}
				onClick={() => dispatch(changeModalState('register', true))}>
				Sign up
			</Button>
		</>
	);

	const userLoggedIcons = (
		<>
			<p>
				{loggedUser?.firstName} {loggedUser?.lastName}
			</p>
			<Button
				onClick={() => {
					dispatch(setLoggedUser(null));
					localStorage.removeItem('api-token');
					navigate('/');
				}}
				radius='xl'
				variant='gradient'
				gradient={{ from: 'orange', to: 'red' }}>
				Logout
			</Button>
		</>
	);

	return (
		<div className='navbar'>
			<div className='fixed-content'>{loggedUser ? userLoggedIcons : userNotLoggedIcons}</div>
			<div className='mobile-navigation'>
				<img src={MobileHamburger} onClick={toggleMobileMenu} className='mobile-hamburger' alt='Mobile Hamburger' />
				<img src={Logo} className='navbar-logo' alt='logo' />
			</div>
		</div>
	);
};

export default Navbar;
