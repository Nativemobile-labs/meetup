import Config from "react-native-config";

// const whitelist: string[] = ["App", "Login"];
const whitelist: string[] = ["PhotoStorageService"];

export default function logger(...args: any[]) {
  if (Config.NODE_ENV !== "development") {
    return;
  }
  console.log.apply(console, args);
}

export const scopedLogger =
  (componentName: string) =>
  (...args: any[]) => {
    if (Config.NODE_ENV !== "development") {
      return;
    }
    if (whitelist.length && !whitelist.includes(componentName)) {
      return;
    }
    console.log(`[${componentName}]`, ...args);
  };
