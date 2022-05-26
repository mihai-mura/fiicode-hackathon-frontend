import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import Masterducer from './redux/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as actionCreators from './redux/actions';
import { NotificationsProvider } from '@mantine/notifications';

const store = createStore(Masterducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ actionCreators }));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<NotificationsProvider>
				<App />
			</NotificationsProvider>
		</Provider>
	</React.StrictMode>
);
