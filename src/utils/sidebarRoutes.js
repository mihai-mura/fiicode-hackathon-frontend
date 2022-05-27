import { IconBrandSafari, IconSettings, IconUserPlus } from '@tabler/icons';
import { MdOutlineFamilyRestroom } from 'react-icons/md';
import ROLE from './roles';

const getRoutes = (role) => {
	switch (role) {
		case ROLE.PARENT:
			return [
				{
					path: '/',
					name: 'Home',
					icon: <IconBrandSafari />,
				},
				{
					path: '/family',
					name: 'Family',
					icon: <MdOutlineFamilyRestroom />,
				},
				{
					path: '/allow-access',
					name: 'Allow Access',
					icon: <IconUserPlus />,
				},
				{
					path: '/settings',
					name: 'Settings',
					icon: <IconSettings />,
				},
			];
		default:
			return [
				{
					path: '/',
					name: 'Home',
					icon: <IconBrandSafari />,
				},
				{
					path: '/family',
					name: 'Family',
					icon: <MdOutlineFamilyRestroom />,
				},
				{
					path: '/settings',
					name: 'Settings',
					icon: <IconSettings />,
				},
			];
	}
};

export default getRoutes;
