// src/features/sales/pages/POSPage.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore.js';
import POSProductSearch from '../components/POSMedicineSearch.jsx';
import POSCart from '../components/POSCart.jsx';
import ReceiptModal from '../components/ReceiptModal.jsx';

export default function POSPage() {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (medicine) => {
    const medicineId = medicine._id || medicine.id || medicine.medicineId;
    const existing = items.find((item) => item.medicineId === medicineId);
    const added = addItem(medicine);

    if (!added) {
      toast('This medicine is out of stock.', { icon: '⚠️' });
      return;
    }

    if (existing) {
      toast('Quantity updated', { icon: 'ℹ️' });
    }
  };

  const handleSaleComplete = (sale) => {
    setCompletedSale(sale);
    setReceiptModalOpen(true);
    setActiveTab('products');
  };

  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setCompletedSale(null);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile tabs */}
      <div className="flex border-b border-gray-200 md:hidden dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'cart'
              ? 'border-b-2 border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400'
              : itemCount > 0
                ? 'text-cyan-600 dark:text-cyan-400'
                : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Cart ({itemCount})
        </button>
      </div>

      {/* Desktop layout */}
      <div className="hidden h-full min-h-0 md:flex">
        <div className="h-full w-[60%] min-h-0 overflow-hidden border-r border-gray-200 dark:border-gray-700">
          <POSProductSearch onAddToCart={handleAddToCart} />
        </div>
        <div className="h-full w-[40%] min-h-0 overflow-hidden">
          <POSCart onSaleComplete={handleSaleComplete} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex-1 min-h-0 overflow-hidden md:hidden">
        {activeTab === 'products' ? (
          <POSProductSearch onAddToCart={handleAddToCart} />
        ) : (
          <POSCart onSaleComplete={handleSaleComplete} />
        )}
      </div>

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={handleCloseReceipt}
        sale={completedSale}
      />
    </div>
  );
}
