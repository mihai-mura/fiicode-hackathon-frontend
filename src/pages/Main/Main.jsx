import React, { useEffect } from 'react';
import { useState, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import './Main.scss';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxPopover, ComboboxList, ComboboxOption, ComboboxInput } from '@reach/combobox';
import '@reach/combobox/styles.css';
import socket from '../../services/socketio';
import ChildPin from '../../images/child-pin.png';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../../components/Notifications/Notifications';
import { useSelector } from 'react-redux';
import ROLE from '../../utils/roles';

const libraries = ['places'];
const mapContainerStyle = {
	width: '100%',
	height: '100%',
};

const options = {
	streetViewControl: false,
};

export default function Main() {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const loggedUser = useSelector((store) => store.loggedUser);

	const [mapCenter, setMapCenter] = useState({ lat: 47.17, lng: 27.57 });
	const [markers, setMarkers] = useState([]);
	const [childrenMarkers, setChildrenMarkers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [childSelected, setChildSelected] = useState(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setMapCenter({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		});

		socket.on('location', (data) => {
			setChildrenMarkers((prev) => {
				const newArray = prev.filter((value) => value.child !== data.child);
				return [...newArray, data];
			});
		});

		return () => {
			socket.off('location');
		};
	}, []);

	useEffect(() => {
		if (!loggedUser) setChildrenMarkers([]);
	}, [loggedUser]);

	//get children location
	useEffect(() => {
		(async () => {
			if (loggedUser?.role === ROLE.MEMBER) {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/children/member/all`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
				});
				if (res.status === 200) {
					const response = await res.json();
					setChildrenMarkers(
						response.map((child) => ({
							name: child.name,
							lat: child.location.lat,
							lng: child.location.lng,
							child: child._id,
						}))
					);
				} else showNotification(errorNotification());
			} else if (loggedUser?.role === ROLE.PARENT) {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/children/all`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
				});
				if (res.status === 200) {
					const response = await res.json();
					setChildrenMarkers(
						response.map((child) => ({
							name: child.name,
							lat: child.location.lat,
							lng: child.location.lng,
							child: child._id,
						}))
					);
				} else showNotification(errorNotification());
			}
		})();
	}, [loggedUser]);

	const onMapClick = useCallback((event) => {
		setMarkers((current) => [
			...current,
			{
				lat: event.latLng.lat(),
				lng: event.latLng.lng(),
				time: new Date(),
			},
		]);
	}, []);

	const mapRef = useRef();
	const onMapLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const panTo = useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng });
		mapRef.current.setZoom(14);
	}, []);

	if (loadError) return 'Error loading maps';
	if (!isLoaded) return 'Loading Maps';

	return (
		<div className='main-page'>
			<div className='mainpage-container'>
				<Search panTo={panTo} />

				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					zoom={12}
					center={mapCenter}
					options={options}
					onLoad={onMapLoad}
					onClick={onMapClick}>
					{markers.map((marker) => (
						<>
							<Marker
								key={marker.time.toISOString()}
								position={{ lat: marker.lat, lng: marker.lng }}
								onRightClick={() =>
									setMarkers((prev) =>
										prev.filter((value) => value.lat !== marker.lat && value.lng !== marker.lng)
									)
								}
								onClick={() => {
									setSelected(marker);
								}}
							/>
							{/* <Circle
								onRightClick={() =>
									setMarkers((prev) => prev.filter((value) => value.lat !== marker.lat && value.lng !== marker.lng))
								}
								center={{ lat: marker.lat, lng: marker.lng }}
								radius={8000}></Circle> */}
						</>
					))}

					{selected ? (
						<InfoWindow
							position={{ lat: selected.lat, lng: selected.lng }}
							onCloseClick={() => {
								setSelected(null);
							}}>
							<div>
								<h2>Marked Area</h2>
								<p>Placed {formatRelative(selected.time, new Date())}</p>
								<div style={{ height: '20px' }}></div>
							</div>
						</InfoWindow>
					) : null}

					{/* children markers */}
					{childrenMarkers.map((marker, index) => (
						<Marker
							key={index}
							// label={marker.name}
							icon={ChildPin}
							position={{ lat: marker.lat, lng: marker.lng }}
							onClick={() => {
								setChildSelected(marker);
							}}></Marker>
					))}

					{childSelected ? (
						<InfoWindow
							position={{ lat: childSelected.lat, lng: childSelected.lng }}
							onCloseClick={() => {
								setChildSelected(null);
							}}>
							<div>
								<h2>{childSelected.name}</h2>
								<div style={{ height: '20px' }}></div>
							</div>
						</InfoWindow>
					) : null}
				</GoogleMap>
			</div>
		</div>
	);
}

function Search({ panTo }) {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			location: { lat: () => 47.17, lng: () => 27.57 },
			radius: 200 * 1000,
		},
	});
	return (
		<div className='search'>
			<Combobox
				onSelect={async (address) => {
					setValue(address, false);
					clearSuggestions();
					try {
						const result = await getGeocode({ address });
						const { lat, lng } = await getLatLng(result[0]);
						console.log(lat, lng);
						panTo({ lat, lng });
					} catch (error) {
						console.log('error');
					}
				}}>
				<ComboboxInput
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					disabled={!ready}
					placeholder='Enter an address'
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
		</div>
	);
}
