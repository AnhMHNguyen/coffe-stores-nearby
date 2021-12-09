import { useState } from "react";
import { useStoreContext, ACTION_TYPES } from "../store/store-context";

const useTrackLocation = () => {
  const [locationError, setLocationError] = useState('');
  // const [latLong, setLatLong] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useStoreContext();

  const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    // setLatLong(`${latitude},${longitude}`);
    setLocationError('');
    setIsFindingLocation(false);

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: {latLong: `${latitude},${longitude}`}
    })
  };

  const error = () => {
    setLocationError('Unable to retrieve your location');
    setIsFindingLocation(false)
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true)
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      setIsFindingLocation(false)
    } else {
      // status.textContent = "Locating..."
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return {
    // latLong,
    handleTrackLocation,
    locationError,
    isFindingLocation
  };
};

export default useTrackLocation;