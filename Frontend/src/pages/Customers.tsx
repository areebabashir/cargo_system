import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

const paymentStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'cod', label: 'COD' },
];
const deliveryTypeOptions = [
  { value: 'all', label: 'All' },
  { value: 'self_pickup', label: 'Self Pickup' },
  { value: 'delivery_by_distributor', label: 'Delivery by Distributor' },
];

function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Name:</span> {customer.name}</div>
          <div><span className="font-medium">Bilty Number:</span> {customer.biltyNumber}</div>
          <div><span className="font-medium">Date:</span> {customer.date ? new Date(customer.date).toLocaleDateString() : ''}</div>
          <div><span className="font-medium">Quantity:</span> {customer.quantity}</div>
          <div><span className="font-medium">Payment Status:</span> {customer.paymentStatus}</div>
          <div><span className="font-medium">Delivery Type:</span> {customer.deliveryType?.replace(/_/g, ' ')}</div>
          <div><span className="font-medium">Phone:</span> {customer.phone}</div>
          <div><span className="font-medium">Address:</span> {customer.address}</div>
          <div><span className="font-medium">Status:</span> {customer.status}</div>
          <div className="col-span-2"><span className="font-medium">Notes:</span> {customer.notes}</div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [deliveryType, setDeliveryType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page,
        limit: PAGE_SIZE,
        search,
        paymentStatus,
        deliveryType,
      };
      const res = await axios.get('http://localhost:8000/api/customers/get/all', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setCustomers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [search, paymentStatus, deliveryType, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-48"
            placeholder="Name, Bilty, Phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Status</label>
          <select
            className="border rounded px-2 py-1"
            value={paymentStatus}
            onChange={e => { setPaymentStatus(e.target.value); setPage(1); }}
          >
            {paymentStatusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Type</label>
          <select
            className="border rounded px-2 py-1"
            value={deliveryType}
            onChange={e => { setDeliveryType(e.target.value); setPage(1); }}
          >
            {deliveryTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Bilty Number</th>
              <th className="p-2">Date</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Payment Status</th>
              <th className="p-2">Delivery Type</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center p-4">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={9} className="text-center p-4">No customers found.</td></tr>
            ) : customers.map((c, i) => (
              <tr
                key={c._id}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedCustomer(c)}
              >
                <td className="p-2">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="p-2 font-semibold">{c.name}</td>
                <td className="p-2">{c.biltyNumber}</td>
                <td className="p-2">{c.date ? new Date(c.date).toLocaleDateString() : ''}</td>
                <td className="p-2">{c.quantity}</td>
                <td className="p-2 capitalize">{c.paymentStatus}</td>
                <td className="p-2 capitalize">{c.deliveryType.replace(/_/g, ' ')}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >Next</button>
      </div>
      <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}