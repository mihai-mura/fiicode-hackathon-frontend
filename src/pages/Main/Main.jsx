import React, { useEffect } from 'react';
import { useState, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import './Main.scss';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxPopover, ComboboxList, ComboboxOption, ComboboxInput, ComboboxButton } from '@reach/combobox';
import '@reach/combobox/styles.css';
import socket from '../../services/socketio';

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

	const [mapCenter, setMapCenter] = useState({ lat: 47.17, lng: 27.57 });
	const [markers, setMarkers] = useState([]);
	const [selected, setSelected] = useState(null);

	const [children, setChildren] = useState([]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setMapCenter({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		});

		socket.on('location', (data) => {
			setChildren((prev) => {
				const newArray = prev.filter((value) => value.child !== data.child);
				return [...newArray, data];
			});
		});

		return () => {
			socket.off('location');
		};
	}, []);

	useEffect(() => {
		//!  set children points
	}, [children]);

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
						<Marker
							key={marker.time.toISOString()}
							position={{ lat: marker.lat, lng: marker.lng }}
							onRightClick={() =>
								setMarkers((prev) => prev.filter((value) => value.lat !== marker.lat && value.lng !== marker.lng))
							}
							onClick={() => {
								setSelected(marker);
							}}
						/>
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
								<button>delete</button>
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
