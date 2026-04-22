import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const { salon } = await getCurrentSalon();
  const products = await prisma.product.findMany({
    where: { salonId: salon.id, isActive: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
  return (
    <InventoryClient
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        minStock: p.minStock,
        unitCost: p.unitCost,
        retailPrice: p.retailPrice,
        supplier: p.supplier,
        unit: p.unit,
        isActive: p.isActive,
      }))}
    />
  );
}
