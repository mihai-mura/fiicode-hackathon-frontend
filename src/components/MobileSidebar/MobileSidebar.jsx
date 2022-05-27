import { useState, useEffect } from 'react';
import './MobileSidebar.scss';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { setLoggedUser } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setLanguage } from '../../redux/actions';
import { IconChevronLeft } from '@tabler/icons';
import { Button } from '@mantine/core';
import getRoutes from '../../utils/sidebarRoutes';

const MobileSidebar = ({ mobileSidebarOpen, toggleMobileMenu }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const loggedUser = useSelector((state) => state.loggedUser);
	const [sidebarRoutes, setSidebarRoutes] = useState([]);

	//setSidebarRoutes according to loggedUser
	useEffect(() => {
		setSidebarRoutes(getRoutes(loggedUser?.role));
	}, [loggedUser]);

	const handleLoggout = () => {
		dispatch(setLoggedUser(null));
		localStorage.removeItem('api-token');
		navigate('/');
		toggleMobileMenu();
	};

	const userNotLoggedIcons = (
		<>
			<div className='buttons-container'>
				<Button
					variant='gradient'
					radius='lg'
					gradient={{ from: 'orange', to: 'red' }}
					onClick={() => {
						dispatch(changeModalState('login', true));
						toggleMobileMenu();
					}}>
					Login
				</Button>
				<Button
					variant='gradient'
					radius='lg'
					gradient={{ from: 'orange', to: 'red' }}
					onClick={() => {
						dispatch(changeModalState('register', true));
						toggleMobileMenu();
					}}>
					Sign up
				</Button>
			</div>
		</>
	);
	const userLoggedIcons = (
		<div className='userLogged-top'>
			<div className='user-menu-link'>{`${loggedUser?.firstName} ${loggedUser?.lastName}`}</div>
		</div>
	);
	const userLoggedContent = (
		<div className='content-mobilesidebar'>
			<section className='routes'>
				{sidebarRoutes?.map((route) => (
					<NavLink to={route.path} key={route.name} className='sidebar-link' onClick={toggleMobileMenu}>
						<div className='sidebar-icon'>{route.icon}</div>
						{mobileSidebarOpen && <div className='sidebar-link-text'>{route.name}</div>}
					</NavLink>
				))}
			</section>
			<div className='bottom-mobilesidebar'>
				<div className='log-out-button' onClick={handleLoggout}>
					Logout
				</div>
			</div>
		</div>
	);
	return (
		<div
			style={{ opacity: mobileSidebarOpen ? '100%' : '0', left: mobileSidebarOpen ? '0' : '-100%' }}
			className='mobilesidebar-container'>
			<div className='sidebar-top-section'>
				<div className='mobilesidebar-logo'>{loggedUser ? userLoggedIcons : userNotLoggedIcons}</div>
				<div className='mobile-arrow'>
					<IconChevronLeft onClick={toggleMobileMenu} />
				</div>
			</div>
			{loggedUser && userLoggedContent}
		</div>
	);
};

export default MobileSidebar;
