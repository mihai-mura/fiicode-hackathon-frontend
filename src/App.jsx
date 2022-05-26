import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';
import Authentification from './components/_Modals/Authentification/Authentification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';

const App = () => {
	return (
		<div className='App'>
			<Router>
				{/* modals */}
				<Authentification />
				<Navbar></Navbar>
				<div className='main'>
					<Routes>
						<Route path='/' element={<Main />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
};
export default App;
