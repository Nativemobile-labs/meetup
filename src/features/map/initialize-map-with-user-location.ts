import { setCoordinates, setCurrentMapCenter } from "./map-slice";
import mapboxgl from "../../config/mapbox";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { MutableRefObject, RefObject } from "react";
import logger from "../../lib/utils/logger";

export default function initializeMapWithUserLocation(
  dispatch: ThunkDispatch<any, any, any>,
  map: MutableRefObject<mapboxgl.Map | null>,
  mapContainer: RefObject<HTMLDivElement>,
  zoom: number,
  setBottomTrayOpen: (open: boolean) => void
) {
  const init = (lat: number, lng: number) => {
    if (!mapContainer.current) return;
    let bottomTrayTimeout: any = null;
    logger("init", lat, lng);
    dispatch(
      setCoordinates({
        latitude: lat,
        longitude: lng,
      })
    );
    dispatch(setCurrentMapCenter({ latitude: lat, longitude: lng, zoom: 11 }));

    console.log({ mapContainer });
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      // style: "mapbox://styles/mapbox/navigation-day-v1",
      // style: "mapbox://styles/mapbox/light-v11",
      // style: "mapbox://styles/mapbox/streets-v12",
      // style: "mapbox://styles/twinc/cllznyphs009k01rchen3hjen",
      style: "mapbox://styles/twinc/cll4l0moe008r01ojhr14dc68",
      center: [lng, lat],
      zoom: zoom,
      logoPosition: "top-left",
      attributionControl: false,
    });

    map.current.on("click", (event) => {
      setBottomTrayOpen(false);
    });

    map.current.on("movestart", (event) => {
      setBottomTrayOpen(false);
      if (bottomTrayTimeout) {
        clearTimeout(bottomTrayTimeout);
      }
    });

    map.current.on("moveend", (event) => {
      logger("movend", event);
      if (!("originalEvent" in event)) {
        logger("not a touch event");
        return;
      }
      const center = map.current?.getCenter();
      if (!center) return;

      dispatch(
        setCurrentMapCenter({
          latitude: center.lat,
          longitude: center.lng,
          zoom: map.current!.getZoom(),
        })
      );

      /** optionally re-open the bottom tray after a delay?? */
      // bottomTrayTimeout = setTimeout(() => {
      //   setBottomTrayOpen(true);
      // }, 1500);

      logger("A moveend event occurred.");
    });

    map.current.addControl(new mapboxgl.AttributionControl(), "top-right");
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      init(pos.coords.latitude, pos.coords.longitude);
    },
    (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        init(34.04172, -118.26281);
      }
    }
  );
}
