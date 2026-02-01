import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Package } from 'lucide-react';

const Dashboard = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 1. Function to get Analytics (Top Sellers)
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders/analytics/top-sellers');
        // Safety Check: Only update if we got an array
        setTopSellers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Analytics Error:", err);
        setTopSellers([]);
      }
    };

    // 2. Function to get Orders (THIS WAS MISSING)
    const fetchOrders = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders');
        // Safety Check: Only update if we got an array
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Orders Error:", err);
        setOrders([]);
      }
    };

    fetchAnalytics();
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
          <TrendingUp className="text-purple-600" /> Top 5 Best Sellers
        </h2>
        {topSellers.length > 0 ? (
          <ul className="space-y-4">
            {topSellers.map((item, index) => (
              <li key={index} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                <div>
                  <span className="font-bold text-gray-800">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-700">{item.totalSold} sold</div>
                  {/* Updated with Indian Rupee symbol */}
                  <div className="text-sm text-green-600 font-medium">₹{item.revenue?.toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No sales data yet.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
          <Package className="text-blue-600" /> Recent Orders
        </h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 text-gray-500">...{order._id.slice(-4)}</td>
                            <td className="py-3 font-medium">{order.customerName}</td>
                            <td className="py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                                    ${order.status === 'Pending' ? 'bg-yellow-500' : 
                                      order.status === 'Served' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                    {order.status}
                                </span>
                            </td>
                            {/* Updated with Indian Rupee symbol */}
                            <td className="py-3 font-bold text-gray-700">₹{order.totalAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;