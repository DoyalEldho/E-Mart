import  { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaShoppingCart, FaBox } from "react-icons/fa";
import { getCartThunk } from '../../features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlistThunk } from '../../features/wishlistSlice';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUser,setIsUser] =useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

// This subscribes your component to the state.cart.length value in your Redux store.
// Whenever state.cart.length changes (via a thunk like addToCartThunk, deleteProductThunk, or getCartThunk), the component automatically re-renders and reflects the new value.
const dispatch = useDispatch();
const cartLength = useSelector((state) => state.carts.items.length);
const wishlistLength = useSelector((state)=>state.wishlist.item.length);

useEffect(() => {
  if (isUser) {
    dispatch(getCartThunk());
    dispatch(getWishlistThunk());
  }
}, [isUser, dispatch]);  



  //user or admin naviagte
  useEffect(() => {
    const user = localStorage.getItem('isUser')==='true';
    if(user){
      setIsUser(true);
    }
    else{
      setIsUser(false);
    }
    const localStatus = localStorage.getItem('isLoggedIn') === 'true';

    if (localStatus) {
      axios
        .get('http://localhost:5000/auth/api/info', {
          withCredentials: true,
        })
        .then((res) => {
          setUserName(res.data.name);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error('User not authenticated:', err);
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]); // recheck on route change

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isUser');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowMenu(false);
    navigate('/login');
  };

  return (
   
<nav className="bg-slate-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center shadow-md border-b border-slate-700 relative">
  {/* Logo + Title */}
  <div className="flex items-center gap-2 sm:gap-2">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTthYRArK6lqu_u5hmN3aTimAiY-EalmaDscuEMNuAiOOowKEdXx2Kdu3fcV5jWVICvUjA&usqp=CAU"
      width={40}
      height={40}
      alt="logo"
      className="rounded-full"
    />
    <h1 className="text-base sm:text-xl font-bold text-yellow-400">E-Mart</h1>
  </div>

  {isLoggedIn && isUser && (
    <div className="flex flex-wrap justify-center items-center ml-auto mr-4 sm:mr-20 gap-5 sm:gap-10 text-xs sm:text-base">
      {/* Dashboard */}
      <Link
        to="/userDashboard"
        className="flex items-center gap-1 sm:gap-3 hover:text-yellow-300 transition"
      >
        <span>Dashboard</span>
      </Link>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className="flex items-center gap-1 sm:gap-3 hover:text-yellow-300 transition"
      >
        <div className="relative">
          <FaHeart className="text-sm sm:text-xl" />
          {wishlistLength > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-300 text-black text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
              {wishlistLength}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      {/* Cart */}
      <Link
        to="/cart"
        className="relative flex items-center gap-1 sm:gap-3 hover:text-yellow-300 transition"
      >
        <div className="relative">
          <FaShoppingCart className="text-sm sm:text-xl" />
          {cartLength > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-300 text-black text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
              {cartLength}
            </span>
          )}
        </div>
        <span>Cart</span>
      </Link>

      {/* Orders */}
      <Link
        to="/user-orders"
        className="flex items-center gap-1 sm:gap-3 hover:text-yellow-300 transition"
      >
        <FaBox className="text-sm sm:text-xl" />
        <span>Orders</span>
      </Link>
    </div>
  )}

  {/* User Menu */}
  <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-0 text-xs sm:text-base" ref={dropdownRef}>
    {isLoggedIn ? (
      <div className="relative cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
        <span className="text-yellow-400 hover:text-yellow-300 transition">{userName}</span>
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-slate-700 border border-slate-500 rounded-md shadow-md z-50 min-w-[120px] sm:min-w-[150px]">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-slate-600 hover:text-yellow-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    ) : (
      <Link
        to="/login"
        className="text-yellow-400 hover:text-yellow-300 transition"
      >
        Login
      </Link>
    )}
  </div>
</nav>

  );
};

export default Navbar;
