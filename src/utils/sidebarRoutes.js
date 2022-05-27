import { IconBrandSafari, IconSettings } from '@tabler/icons';
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
					path: '/settings',
					name: 'Settings',
					icon: <IconSettings />,
				},
			];
	}
};

export default getRoutes;
