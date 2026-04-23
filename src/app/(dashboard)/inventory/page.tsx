import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const { salon } = await getCurrentSalon();
  const db = prismaForSalon(salon.id);
  const products = await db.product.findMany({
    where: { isActive: true },
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
