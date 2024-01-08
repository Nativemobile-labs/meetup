export const isAppInstalled = async (): Promise<boolean> => {
  if (process.env.REACT_APP_FORCE_INSTALLED === "yes") {
    return true;
  }

  /**
   * try to see if this fixes install-state for android
   */
  // if (
  //   !("getInstalledRelatedApps" in window.navigator) ||
  //   typeof window.navigator.getInstalledRelatedApps === "undefined"
  // ) {
  return window.matchMedia("(display-mode: standalone)").matches;
  // }
  //
  // // @ts-ignore
  // for (const app of await navigator.getInstalledRelatedApps()) {
  //   if (
  //     app.platform === "webapp" &&
  //     app.url === "https://app.twibs.io.com/manifest.json"
  //   ) {
  //     return true;
  //   }
  // }
  //
  // return false;
};

// https://stackoverflow.com/a/21742107/2543424
export const getMobileOperatingSystem = ():
  | "Android"
  | "iOS"
  | "Windows Phone"
  | "unknown" => {
  // @ts-ignore
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  // @ts-ignore
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
};

export const canInstall = async (): Promise<boolean> => {
  if (
    (await isAppInstalled()) ||
    window.location.protocol.toLowerCase().replaceAll(":", "") !== "https"
  ) {
    return false;
  }

  const os = getMobileOperatingSystem();

  return (
    ["Android", "iOS"].includes(os) ||
    process.env.REACT_APP_FORCE_INSTALLED === "yes"
  );
};
