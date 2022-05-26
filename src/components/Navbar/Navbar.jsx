import React from 'react';
import './Navbar.scss';
import CityQLogo from '../../images/CityQ.svg';
import MobileHamburger from '../../images/mobile-hamburger.svg';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../redux/actions';

const Navbar = ({ toggleMobileMenu }) => {
	const dispatch = useDispatch();
	return (
		<div className='navbar'>
			<div className='navbar-container'>
				<div className='desktop-navigation'>
					<img src={CityQLogo} className='cityq-logo' alt='CityQLogo' />
					<div className='buttons'>
						<Button
							onClick={() => dispatch(changeModalState('login', true))}
							variant='gradient'
							gradient={{ from: 'orange', to: 'red' }}>
							Log in
						</Button>
						<Button
							onClick={() => dispatch(changeModalState('register', true))}
							variant='gradient'
							gradient={{ from: 'orange', to: 'red' }}>
							Sign up
						</Button>
					</div>
				</div>
				{/* <div className='mobile-navigation'>
					<img src={CityQLogo} className='cityq-logo' alt='CityQLogo' />
					<img src={MobileHamburger} onClick={toggleMobileMenu} className='mobile-hamburger' alt='Mobile Hamburger' />
				</div> */}
			</div>
		</div>
	);
};

export default Navbar;
