// src/features/sales/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      discountType: 'amount',
      paymentMethod: 'cash',
      customerName: '',
      notes: '',

      addItem: (medicine) => {
        if (medicine.stock === 0) return false;

        const medicineId = medicine._id || medicine.id || medicine.medicineId;
        const items = get().items;
        const existing = items.find((item) => item.medicineId === medicineId);

        if (existing) {
          const newQty = Math.min(existing.quantity + 1, medicine.stock);
          set({
            items: items.map((item) =>
              item.medicineId === medicineId
                ? { ...item, quantity: newQty, stock: medicine.stock }
                : item
            ),
          });
          return true;
        }

        set({
          items: [
            ...items,
            {
              medicineId,
              name: medicine.name,
              genericName: medicine.genericName || '',
              unitPrice: medicine.unitPrice ?? medicine.sellingPrice ?? 0,
              stock: medicine.stock,
              quantity: 1,
              requiresPrescription: medicine.requiresPrescription ?? false,
            },
          ],
        });
        return true;
      },

      removeItem: (medicineId) => {
        set({ items: get().items.filter((item) => item.medicineId !== medicineId) });
      },

      updateQty: (medicineId, newQty) => {
        set({
          items: get().items.map((item) => {
            if (item.medicineId !== medicineId) return item;

            let quantity = newQty;
            if (quantity < 1) quantity = 1;
            if (quantity > item.stock) quantity = item.stock;

            return { ...item, quantity };
          }),
        });
      },

      clearCart: () => {
        set({
          items: [],
          discount: 0,
          discountType: 'amount',
          customerName: '',
          notes: '',
        });
      },

      setDiscount: (value, type) => set({ discount: value, discountType: type }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setCustomerName: (name) => set({ customerName: name }),
      setNotes: (notes) => set({ notes }),
    }),
    {
      name: 'pharmacy-cart',
    }
  )
);

export function useCartTotals() {
  const items = useCartStore((state) => state.items);
  const discount = useCartStore((state) => state.discount);
  const discountType = useCartStore((state) => state.discountType);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const discountAmount =
    discountType === 'percent' ? subtotal * (discount / 100) : discount;

  const total = Math.max(0, subtotal - discountAmount);

  return { subtotal, discountAmount, total };
}

export default useCartStore;
