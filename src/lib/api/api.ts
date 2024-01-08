// // import { auth } from "../../config/firebase";
// import auth from "@react-native-firebase/auth";
// import axios from "axios";
// import Config from "react-native-config";

// // not actual secure but fine for now since this is just an experiment. these endpoints are just for fetching general data anyway
// const serverAuthKey = Config.REACT_APP_SERVER_AUTH_KEY;

// console.log('serverAuthKey',serverAuthKey)

// const fullUrl = (path: string, query: { [key: string | number]: any } = {}) => {
//   const url = new URL(
//     `${Config.REACT_APP_API_BASE}${path}`.replace(
//       ":firebase_uid",
//       auth().currentUser?.uid || "MISSING_UID",
//     ),
//   );
//   Object.keys(query).forEach((key) =>
//     url.searchParams.append(key, query[key.toString()].toString()),
//   );

//   console.log("FULL URL: ", url.toString());
//   return url.toString();
// };

// export const api = {
//   userAuth: {
//     get: async <T>(
//       endpoint: string,
//       query: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const token = await auth().currentUser?.getIdToken();
//       const response = await axios.get(fullUrl(endpoint, query), {
//         headers: {
//           Authorization: token,
//         },
//       });

//       return response.data;
//     },
//     post: async <T>(
//       endpoint: string,
//       body: { [key: string | number]: any } = {},
//       query: { [key: string | number]: any } = {},
//       headers: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const token = await auth().currentUser?.getIdToken();
//       const response = await axios.post(fullUrl(endpoint, query), body, {
//         headers: {
//           ...headers,
//           ...{
//             Authorization: token,
//           },
//         },
//       });

//       return response.data;
//     },
//     put: async <T>(
//       endpoint: string,
//       body: { [key: string | number]: any } = {},
//       query: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const token = await auth().currentUser?.getIdToken();
//       const response = await axios.put(fullUrl(endpoint, query), body, {
//         headers: {
//           Authorization: token,
//         },
//       });

//       return response.data;
//     },
//     delete: async <T>(
//       endpoint: string,
//       query: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const token = await auth().currentUser?.getIdToken();
//       const response = await axios.delete(fullUrl(endpoint, query), {
//         headers: {
//           Authorization: token,
//         },
//       });

//       return response.data;
//     },
//   },
//   serverAuth: {
//     get: async <T>(
//       endpoint: string,
//       query: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const response = await axios.get(fullUrl(endpoint, query), {
//         headers: {
//           Authorization: serverAuthKey,
//         },
//       });

//       return response.data;
//     },
//     post: async <T>(
//       endpoint: string,
//       body: { [key: string | number]: any } = {},
//       query: { [key: string | number]: any } = {},
//     ): Promise<T> => {
//       const response = await axios.post(fullUrl(endpoint, query), body, {
//         headers: {
//           Authorization: serverAuthKey,
//         },
//       });

//       return response.data;
//     },
//   },
// };
