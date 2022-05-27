import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';
import Authentification from './components/_Modals/Authentification/Authentification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';
import Sidebar from './components/Sidebar/Sidebar';
import MobileSidebar from './components/MobileSidebar/MobileSidebar';
import UserSettings from './pages/UserSettings/UserSettings';
import RestorePassword from './pages/RestorePassword/RestorePassword';
import RouteHandler from './pages/_RouteHandler/RouteHandler';
import Family from './pages/Family/Family';

const App = () => {
	const [mobileSidebarOpen, setmobileSidebarOpen] = useState(false);

	return (
		<div className='App'>
			<Router>
				{/* modals */}
				<Authentification />

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
