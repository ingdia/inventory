import Table from '../../../shared/components/Table';
import Badge from '../../../shared/components/Badge';
import { formatDate } from '../../../shared/utils/formatDate';
import { getStockStatus, stockBadgeVariant, stockStatusLabel } from '../utils/inventory.utils';

export default function InventoryTable({ inventory, loading }) {
  const columns = [
    { key: 'medicine', label: 'Medicine', render: (item) => (
      <div>
        <p className="font-medium text-white">{item.medicine?.name || '—'}</p>
        {item.medicine?.genericName && <p className="text-xs text-slate-500">{item.medicine.genericName}</p>}
      </div>
    )},
    { key: 'category', label: 'Category', render: (item) => item.medicine?.category?.name || '—' },
    { key: 'quantity', label: 'Quantity', render: (item) => (
      <span className="font-semibold text-white">{item.quantity}</span>
    )},
    { key: 'unit', label: 'Unit', render: (item) => <span className="capitalize">{item.medicine?.unit || '—'}</span> },
    { key: 'reorderLevel', label: 'Reorder Level', render: (item) => item.medicine?.reorderLevel ?? '—' },
    { key: 'status', label: 'Stock Status', render: (item) => {
      const status = getStockStatus(item);
      return <Badge variant={stockBadgeVariant[status]}>{stockStatusLabel[status]}</Badge>;
    }},
    { key: 'expiryDate', label: 'Expiry Date', render: (item) => formatDate(item.medicine?.expiryDate) },
    { key: 'lastRestockedAt', label: 'Last Updated', render: (item) => formatDate(item.lastRestockedAt) },
  ];

  return <Table columns={columns} data={inventory} loading={loading} />;
}
