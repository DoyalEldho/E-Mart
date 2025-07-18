import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByStatus } from '../../features/orderSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, length } = useSelector((state) => state.orders);
  const [prevLength, setPrevLength] = useState(0);
  const firstLoad = useRef(true);

  useEffect(() => {
    dispatch(fetchOrdersByStatus({ status: 'processing' }))
      .then((data) => {
        if (!data.payload) return;

        const newLength = data.payload.length;

        if (!firstLoad.current && newLength > prevLength) {
          toast(`You have  ${newLength} new orders!`, {
            icon: '🔔',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }

        setPrevLength(newLength);
        firstLoad.current = false;
      });
  }, [dispatch]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 min-h-screen bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
