import React from 'react';
import './ChildrenCard.scss';
import { Button } from '@mantine/core';

const ChildrenCard = ({ children }) => {
	return (
		<div className='children-card'>
			<p>{children}</p>
			<Button color='red'>Delete</Button>
		</div>
	);
};

export default ChildrenCard;
