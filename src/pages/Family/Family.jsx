import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import './Family.scss';

const Family = () => {
	const dispatch = useDispatch();

	return (
		<div className='page page-family'>
			<div className='header'>
				<Button
					variant='gradient'
					gradient={{ from: 'orange', to: 'red' }}
					radius='xl'
					onClick={() => dispatch(changeModalState('addChild', true))}>
					Add children
				</Button>
			</div>
		</div>
	);
};
export default Family;
