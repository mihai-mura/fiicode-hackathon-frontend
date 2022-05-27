import { Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import ChildrenCard from '../../components/ChildrenCard/ChildrenCard';
import { changeModalState } from '../../redux/actions';
import './Family.scss';

const Family = () => {
	const dispatch = useDispatch();
	const childrens = ['Tente', 'Gabor', 'Vivi'];

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
			<div className='children-container'>
				{childrens.map((children) => (
					<ChildrenCard children={children}></ChildrenCard>
				))}
			</div>
		</div>
	);
};
export default Family;
