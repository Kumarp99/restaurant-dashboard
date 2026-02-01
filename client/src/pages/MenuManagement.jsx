import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Backend URL
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menu';
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchMenu = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const toggleAvailability = async (id, currentStatus) => {
    const previousMenuState = [...menu];

    const updatedMenu = menu.map(item =>
      item._id === id ? { ...item, isAvailable: !currentStatus } : item
    );
    setMenu(updatedMenu);

    try {
      await axios.patch(`${API_URL}/${id}/availability`);
    } catch (err) {
      setMenu(previousMenuState);
      alert("Failed to update status. Reverting...");
    }
  };

  const deleteItem = async (id) => {
    if(window.confirm("Delete this item?")) {
        await axios.delete(`${API_URL}/${id}`);
        fetchMenu(debouncedSearchTerm);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search menu items..."
          className="pl-10 p-2 border rounded w-full max-w-md shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.category}</span>
                 <p className="text-xl font-bold mt-2 text-green-700">₹{item.price.toFixed(2)}</p>
                  {item.ingredients && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.ingredients}</p>}
                </div>
                <button
                    onClick={() => toggleAvailability(item._id, item.isAvailable)}
                    className={`p-2 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                    {item.isAvailable ? <Power size={20} /> : <PowerOff size={20} />}
                </button>
              </div>
              <div className="mt-4 flex justify-end border-t pt-3">
                <button onClick={() => deleteItem(item._id)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;