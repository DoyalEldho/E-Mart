
// import Register from './components/Register/Register'
// import Login from './components/Login/Login'
// import { Routes, Route } from 'react-router-dom'
// import Dashboard from './components/UserDashboard/Dashboard'
// import { Toaster } from 'react-hot-toast';
// import AdminDashboard from './components/AdminDashboard/AdminDashboard'
// import Navbar from './components/Navbar/Navbar'
// import AddProduct from './components/AdminDashboard/AddProduct'
// import MyProducts from './components/AdminDashboard/MyProducts'
// import Orders from './components/AdminDashboard/Orders'
// import Shipped from './components/AdminDashboard/Shipped'
// import Delivered from './components/AdminDashboard/Delivered'
// import DailyOrders from './components/AdminDashboard/DailyOrders'
// import Cart from './components/UserDashboard/Cart';
// import Wishlist from './components/UserDashboard/Wishlist';
// import Footer from './components/Footer/Footer';
// import OrderHistory from './components/UserDashboard/OrderHistory';



// export default  function App() {


//   return (
//     <div  className="flex flex-col min-h-screen">
//       <Navbar/>
//       <Toaster position="top-center" reverseOrder={false} />

//       <main className="flex-grow">
//       <Routes>
//         <Route path="/" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/userDashboard" element={<Dashboard/>} />
        

//         {/*  NESTED DASHBOARD ROUTES */}
//                <Route path="/adminDashboard" element={<AdminDashboard />}>
//                <Route path="add-product" element={<AddProduct/>} /> 
//                <Route path="my-products" element={<MyProducts/>} /> 
//                <Route path="orders" element={<Orders/>} /> 
//                <Route path="shipped" element={<Shipped/>} /> 
//                <Route path="delivered" element={<Delivered/>} /> 
//                <Route path="chart" element={<DailyOrders/>} /> 
//                  </Route>
             
//              {/* user */}
//           <Route path ='/cart' element={<Cart/>} />
//           <Route path ='/wishlist' element={<Wishlist/>} />
//           <Route path ='/user-orders' element={<OrderHistory/>} />

//       </Routes>
//       </main>
//           <Footer/>
//     </div>
//   )
// }


import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/Loader/Spinner';

const Register = lazy(() => import('./components/Register/Register'));
const Login = lazy(() => import('./components/Login/Login'));
const Dashboard = lazy(() => import('./components/UserDashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard/AdminDashboard'));
const AddProduct = lazy(() => import('./components/AdminDashboard/AddProduct'));
const MyProducts = lazy(() => import('./components/AdminDashboard/MyProducts'));
const Orders = lazy(() => import('./components/AdminDashboard/Orders'));
const Shipped = lazy(() => import('./components/AdminDashboard/Shipped'));
const Delivered = lazy(() => import('./components/AdminDashboard/Delivered'));
const DailyOrders = lazy(() => import('./components/AdminDashboard/DailyOrders'));
const Cart = lazy(() => import('./components/UserDashboard/Cart'));
const Wishlist = lazy(() => import('./components/UserDashboard/Wishlist'));
const OrderHistory = lazy(() => import('./components/UserDashboard/OrderHistory'));

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex-grow">
        <Suspense fallback={<Spinner/>}>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userDashboard" element={<Dashboard />} />

            <Route path="/adminDashboard" element={<AdminDashboard />}>
              <Route path="add-product" element={<AddProduct />} />
              <Route path="my-products" element={<MyProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="shipped" element={<Shipped />} />
              <Route path="delivered" element={<Delivered />} />
              <Route path="chart" element={<DailyOrders />} />
            </Route>

            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/user-orders" element={<OrderHistory />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
