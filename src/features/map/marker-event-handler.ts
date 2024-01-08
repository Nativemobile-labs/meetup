import { SlimLocationModel } from "../../lib/types";
import mapboxgl from "../../config/mapbox";
import { off, on } from "../../lib/utils/event-bus";
import { store } from "../../state/store";
import logger from "../../lib/utils/logger";

export default function markerEventHandler(
  marker: HTMLDivElement,
  location: SlimLocationModel,
  map: mapboxgl.Map,
  setCloseEverything: (isClosed: boolean) => void,
  onMarkerTap: (location: SlimLocationModel) => void,
  useAppSelector: any
): Function {
  // const { triggerArticle, startArticle } = this.props;
  const { svg, css, timeline, physics, chain, delay, tween, easing } = window.popmotionXL;

  const markerSVG = marker.children[0];
  if (!markerSVG) return () => {};
  const markerImage = markerSVG.querySelector(".e-marker__image");
  const markerCircle = markerSVG.querySelector(".e-marker__circle");
  const markerText = markerSVG.querySelector(".e-marker__text");
  const markerLoader = markerSVG.querySelector(".e-marker__loader");
  const markerRenderer = css(markerSVG, {
    enableHardwareAcceleration: false,
  });
  const imageRenderer = css(markerImage);
  const textRenderer = css(markerText);
  const loadRenderer = css(markerLoader);
  const loadScaleRenderer = css(markerLoader);
  const markerGrowSize = 4;
  const markerScale = physics({
    from: 1,
    to: markerGrowSize,
    velocity: 20,
    spring: 300,
    friction: 0.8,
    onUpdate: (x: any) => markerRenderer.set("scale", x),
  });

  const loadScale = tween({
    from: 0,
    to: 1,
    duration: 300,
    ease: easing.backOut,
    onUpdate: (x: any) => loadScaleRenderer.set("scale", x),
  });

  const loadRotate = tween({
    from: 0,
    to: 360,
    duration: 900,
    loop: Infinity,
    ease: easing.anticipate,
    onUpdate: (x: any) => loadRenderer.set("rotate", x),
  });

  const imageScale = tween({
    from: 0,
    to: 1,
    duration: 300,
    ease: easing.backOut,
    onUpdate: (x: any) => imageRenderer.set("scale", x),
  });

  const textToggle = tween({
    from: 0,
    to: 1,
    duration: 300,
    ease: easing.backOut,
    onUpdate: (x: any) => textRenderer.set("opacity", x),
  });

  const hoverTimeline = timeline([imageScale, "-100", textToggle]);

  let isFlying = false;
  let open = false;
  let center: any = null;

  function closeMarker() {
    markerScale.setProps({
      from: markerGrowSize,
      to: 1,
    });
    marker.style.zIndex = "101";
    markerScale.start();
    if (center !== null) {
      map.flyTo({
        center: [center.longitude, center.latitude],
        offset: [0, 0],
        zoom: center.zoom,
      });
    }

    // hoverTimeline.reverse().start();
  }

  const unsubscribe = store.subscribe(() => {
    const { currentMapCenter } = store.getState().map;
    center = currentMapCenter;
  });

  const handleCloseMarker = () => {
    unsubscribe();
    closeMarker();
    open = false;
    off(`close-marker`, handleCloseMarker);
  };

  marker.addEventListener("click", () => {
    logger("marker clicked");
    setCloseEverything(true);

    on(`close-marker`, handleCloseMarker);

    onMarkerTap(location);

    if (open) {
      closeMarker();
      open = false;
      return;
    }

    setTimeout(() => {
      open = true;

      // offSetMarker(marker, markerGrowSize, map);
      marker.style.zIndex = "9999999";
      markerScale.setProps({
        from: 1,
        to: markerGrowSize,
      });
      imageScale.setProps({ playDirection: 1 });
      // hoverTimeline.setProps({ playDirection: 1 });
      // textToggle.setProps({ playDirection: 1 });
      markerScale.start();
      // hoverTimeline.start();

      isFlying = true;
      // startArticle(location);
      setTimeout(() => {
        map.flyTo({
          center: [location.longitude, location.latitude],
          offset: [0, 250],
          zoom: 11,
        });
      }, 250);
    }, 250);
    // loadScale.setProps({
    //   playDirection: 1,
    //   from: 0,
    //   to: 1,
    // });
    // loadScale.start();
    // loadRotate.start();
    // imageScale.reverse().start();
    // textToggle.reverse().start();

    // map.scrollZoom.disable();

    // map.on("moveend", (e) => {
    //   if (isFlying) {
    //     // triggerArticle();
    //     loadScale.reverse().start();
    //     loadRotate.stop();
    //     map.scrollZoom.enable();
    //     isFlying = false;
    //   }
    // });
  });

  // marker.addEventListener("mouseleave", () => {
  //   if (!isFlying) {
  //     closeMarker();
  //     loadScale.reverse().start();
  //     loadRotate.complete();
  //   }
  // });
  return closeMarker;
}
