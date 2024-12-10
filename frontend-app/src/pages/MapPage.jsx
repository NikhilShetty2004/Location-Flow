import React, { useState, useEffect, lazy, Suspense, useContext } from "react";
import Map, { NavigationControl } from "react-map-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "./mappage.css";
import Loader from "../components/ui/Loader";
import MapMarker from "../components/marker/MapMarker";
import debounce from "lodash.debounce";
import apiRequest from "../lib/ApiReqest";

import { AuthContext } from "../context/AuthContext";
import { LocationContext } from "../context/LocationContext";
import { useNavigate } from "react-router-dom";

const MarkerPopup = lazy(() => import("../components/popup/MarkerPopup"));
const UserMarkerPopup = lazy(() =>
  import("../components/popup/UserMarkerPopup")
);
const UserAuthentication = lazy(() =>
  import("../components/authentication/UserAuthentication")
);

const MapPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { pins, SetPins, SetNewPlace } = useContext(LocationContext);
  
  const [viewport, setViewport] = useState({
    latitude: 6.927079,
    longitude: 79.861244,
    zoom: 2,
  });
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLocationReady, setIsLocationReady] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await apiRequest.get("/api/pins");
        SetPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();

    // Request location permission on component mount
    if (currentUser) {
      requestLocationPermission();
    }
  }, [currentUser]);

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          setViewport({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14,
          });
          setLocationPermission('granted');
          setIsLocationReady(true);
        },
        (error) => {
          // Error callback
          console.error("Location permission denied:", error);
          setLocationPermission('denied');
          setIsLocationReady(false);
        },
        {
          // Options to make the prompt appear
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation is not supported
      setLocationPermission('unavailable');
      setIsLocationReady(false);
    }
  };

  const handleGeocodingSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        {
          params: {
            access_token: process.env.REACT_APP_MAPBOX,
            autocomplete: true,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedGeocodingSearch = debounce(handleGeocodingSearch, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value) {
      debouncedGeocodingSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const [longitude, latitude] = suggestion.center;
    setViewport({ ...viewport, latitude, longitude, zoom: 12 });
    setSearchInput(suggestion.place_name);
    setSuggestions([]);
  };

  const handleAddReview = () => {
    SetNewPlace({
      lat: viewport.latitude,
      long: viewport.longitude,
    });
  };

  // Render location permission request if not granted
  if (!isLocationReady) {
    return (
      <div className="map-page-container">
        <div className="navbar">
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                value={searchInput}
                placeholder="Search for location"
                onChange={handleInputChange}
                disabled
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="map-action-buttons">
            {currentUser && (
              <>
                <button 
                  onClick={() => navigate("/pins")} 
                  className="view-pins-button"
                  disabled
                >
                  View My Pins
                </button>
              </>
            )}
          </div>
        </div>

        <div className="location-permission-modal-wrapper">
          <div className="location-permission-modal">
            <h2>Location Access Required</h2>
            <p>This application requires your location to function properly.</p>
            <button onClick={requestLocationPermission}>
              Enable Location Access
            </button>
            {locationPermission === 'denied' && (
              <p className="error-message">
                Location access was denied. Please enable it in your browser settings.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={searchInput}
              placeholder="Search for location"
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="map-action-buttons">
          {currentUser && (
            <>
              <button onClick={handleAddReview} className="add-review-button">
                Add Review
              </button>
              <button
                onClick={() => navigate("/pins")}
                className="view-pins-button"
              >
                View My Pins
              </button>
            </>
          )}
        </div>
      </div>

      {/* Map container */}
      <div className="map-container">
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-left" />

          {pins.map((p) => (
            <React.Fragment key={p._id}>
              <MapMarker />
              <Suspense fallback={<Loader />}>
                <MarkerPopup p={p} />
              </Suspense>
            </React.Fragment>
          ))}

          <Suspense fallback={<Loader />}>
            <UserMarkerPopup />
            <UserAuthentication />
          </Suspense>
        </Map>
      </div>
    </div>
  );
};

export default MapPage;