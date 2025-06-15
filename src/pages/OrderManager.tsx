import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/OrderService';
import { Order, OrderStatus } from '../types/orderTypes';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Handle status filter change
  useEffect(() => {
    const filterOrders = async () => {
      try {
        setLoading(true);
        
        if (statusFilter === 'all') {
          setFilteredOrders(orders);
        } else {
          const filteredOrders = orders.filter(order => order.status === statusFilter);
          setFilteredOrders(filteredOrders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    filterOrders();
  }, [statusFilter, orders]);

  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open order details modal
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      
      // Update state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
      );
      setOrders(updatedOrders);
      
      // If viewing order details, update selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date() });
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Status badge color
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.READY:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Order Manager</h1>
        
        {/* Status filter */}
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="block w-40 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Orders</option>
            <option value={OrderStatus.PENDING}>Pending</option>
            <option value={OrderStatus.PROCESSING}>Processing</option>
            <option value={OrderStatus.READY}>Ready</option>
            <option value={OrderStatus.COMPLETED}>Completed</option>
            <option value={OrderStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Orders Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id?.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.userId.substring(0, 8)}...</div>
                  {order.contactPhone && (
                    <div className="text-sm text-gray-500">{order.contactPhone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.items.length} items</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  
                  {/* Status change buttons */}
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() => order.id && handleStatusChange(order.id, OrderStatus.PROCESSING)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Process
                    </button>
                  )}
                  
                  {order.status === OrderStatus.PROCESSING && (
                    <button
                      onClick={() => order.id && handleStatusChange(order.id, OrderStatus.READY)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Mark Ready
                    </button>
                  )}
                  
                  {order.status === OrderStatus.READY && (
                    <button
                      onClick={() => order.id && handleStatusChange(order.id, OrderStatus.COMPLETED)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Complete
                    </button>
                  )}
                  
                  {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING) && (
                    <button
                      onClick={() => order.id && handleStatusChange(order.id, OrderStatus.CANCELLED)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details - #{selectedOrder.id?.substring(0, 8)}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Information</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Status: </span>
                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Created: </span>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Last Updated: </span>
                    {formatDate(selectedOrder.updatedAt)}
                  </p>
                  {selectedOrder.completedAt && (
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-medium">Completed: </span>
                      {formatDate(selectedOrder.completedAt)}
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">ID: </span>
                    {selectedOrder.userId}
                  </p>
                  {selectedOrder.contactPhone && (
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-medium">Phone: </span>
                      {selectedOrder.contactPhone}
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Delivery Information</h4>
                  {selectedOrder.deliveryAddress ? (
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-medium">Address: </span>
                      {selectedOrder.deliveryAddress}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">No delivery address provided</p>
                  )}
                  {selectedOrder.paymentMethod && (
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-medium">Payment: </span>
                      {selectedOrder.paymentMethod}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.imageUrl && (
                              <div className="flex-shrink-0 h-8 w-8 mr-3">
                                <img className="h-8 w-8 rounded object-cover" src={item.imageUrl} alt={item.name} />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              {item.notes && (
                                <div className="text-xs text-gray-500">Note: {item.notes}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                        Total:
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedOrder.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-3">
                  {selectedOrder.status !== OrderStatus.COMPLETED && selectedOrder.status !== OrderStatus.CANCELLED && (
                    <>
                      {selectedOrder.status === OrderStatus.PENDING && (
                        <button
                          onClick={() => selectedOrder.id && handleStatusChange(selectedOrder.id, OrderStatus.PROCESSING)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Process Order
                        </button>
                      )}
                      
                      {selectedOrder.status === OrderStatus.PROCESSING && (
                        <button
                          onClick={() => selectedOrder.id && handleStatusChange(selectedOrder.id, OrderStatus.READY)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Mark as Ready
                        </button>
                      )}
                      
                      {selectedOrder.status === OrderStatus.READY && (
                        <button
                          onClick={() => selectedOrder.id && handleStatusChange(selectedOrder.id, OrderStatus.COMPLETED)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Complete Order
                        </button>
                      )}
                      
                      <button
                        onClick={() => selectedOrder.id && handleStatusChange(selectedOrder.id, OrderStatus.CANCELLED)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}    </div>
  );
}