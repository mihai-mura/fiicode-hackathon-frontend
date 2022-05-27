import Navbar from './components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import Authentification from './components/_Modals/Authentification/Authentification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';
import Sidebar from './components/Sidebar/Sidebar';
import MobileSidebar from './components/MobileSidebar/MobileSidebar';
import UserSettings from './pages/UserSettings/UserSettings';
import RestorePassword from './pages/RestorePassword/RestorePassword';
import RouteHandler from './pages/_RouteHandler/RouteHandler';
import Family from './pages/Family/Family';
import AddChildModal from './components/_Modals/AddChildModal/AddChildModal';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedUser } from './redux/actions';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from './components/Notifications/Notifications';
import { LoadingOverlay } from '@mantine/core';
import socket from './services/socketio';
import AllowAccess from './pages/AllowAccess/AllowAccess';
import CreateUserModal from './components/_Modals/CreateUserModal/CreateUserModal';

const App = () => {
	const [mobileSidebarOpen, setmobileSidebarOpen] = useState(false);
	const loggedUser = useSelector((state) => state.loggedUser);
	const dispatch = useDispatch();

	const [loadingOverlay, setLoadingOverlay] = useState(false);
	//*inits
	//setLoggedUser
	useEffect(() => {
		(async () => {
			if (localStorage.getItem('api-token') && !loggedUser) {
				setLoadingOverlay(true);
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
				});
				const user = await res.json();
				if (res.status === 200) {
					dispatch(setLoggedUser(user));
					setLoadingOverlay(false);
					socket.emit('parent-id', user._id);
				} else {
					showNotification(errorNotification());
				}
			}
		})();
	}, [dispatch, loggedUser]);

	return (
		<div className='App'>
			<LoadingOverlay visible={loadingOverlay} loaderProps={{ size: 'xl' }} />
			<Router>
				{/* modals */}
				<Authentification />
				<AddChildModal />
				<CreateUserModal />

				<Sidebar />
				<MobileSidebar
					mobileSidebarOpen={mobileSidebarOpen}
					toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)}
				/>
				<div className='main'>
					<Navbar toggleMobileMenu={() => setmobileSidebarOpen((prev) => !prev)} />
					<Routes>
						<Route path='/recover-password/:token' element={<RestorePassword />} />
						<Route path='/' element={<Main />} />
						<Route
							path='/allow-access'
							element={
								<RouteHandler logged>
									<AllowAccess />
								</RouteHandler>
							}
						/>
						<Route
							path='/family'
							element={
								<RouteHandler logged>
									<Family />
								</RouteHandler>
							}
						/>
						<Route
							path='/settings'
							element={
								<RouteHandler logged>
									<UserSettings />
								</RouteHandler>
							}
						/>
					</Routes>
				</div>
			</Router>
		</div>
	);
};
export default App;
