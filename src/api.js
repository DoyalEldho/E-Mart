// import axios from 'axios';
// import { toast } from 'react-toastify';

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true, 
// });

// // Interceptor for handling 401 errors globally
// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       toast.error("Session expired. Please log in again.");
//       window.location.href = "/login"; 
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
