const listeners: { [eventName: string]: Function[] } = {};

export const on = (event: string, callback: Function) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }

  listeners[event].push(callback);
};

export const off = (event: string, callback: Function) => {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(
      (listener) => listener !== callback,
    );
  }
};

export const emit = <T>(event: string, data: T) => {
  if (listeners[event]) {
    listeners[event].forEach((listener) => listener(data));
  }
};
