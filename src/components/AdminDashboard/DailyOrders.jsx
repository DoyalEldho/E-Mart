import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,Legend 
} from 'recharts';

const DailyOrders = () => {
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/charts',{withCredentials:true} ); 
        setOrdersPerDay(res.data.ordersPerDay);
        setBestSelling(res.data.bestSellingProducts);
      } catch (err) {
        console.error('Failed to fetch chart data', err);
      }
    };
    fetchCharts();
  }, []);

  return (
<div className="flex flex-wrap gap-6 p-5 bg-gray-100">
  {/* Orders Per Day Chart */}
  <div className="flex-1 min-w-[320px] bg-white p-5 rounded-2xl shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4"> Orders Per Day</h3>
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={ordersPerDay}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          label={{ value: 'Date', position: 'insideBottom', offset: -20 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: -10 }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={30} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4, stroke: '#6366f1', strokeWidth: 1, fill: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Best Selling Products Chart */}
  <div className="flex-1 min-w-[320px] bg-white p-5 rounded-2xl shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Best-Selling Products</h3>
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={bestSelling}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="title"
          interval={0}
          angle={-30}
          textAnchor="end"
          height={80}
          label={{ value: 'Product', position: 'insideBottom', offset: -30 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          label={{ value: 'Quantity Sold', angle: -90, position: 'insideLeft', offset: -10 }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={30} />
        <Bar dataKey="quantity" fill="#10b981" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


  );
};

export default DailyOrders;
