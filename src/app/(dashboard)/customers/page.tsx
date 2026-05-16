import { getSalonData } from '@/lib/salonData';
import ImportExportBar from '@/components/shared/ImportExportBar';
import NewCustomerButton from './NewCustomerButton';
import CustomersTable from './CustomersTable';

export default async function CustomersPage() {
  const { customers } = await getSalonData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">顧客管理</h1>
          <p className="text-sm text-stone-500 mt-1">全 {customers.length}名</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <NewCustomerButton />
          <ImportExportBar
            label="顧客"
            importUrl="/api/customers/import"
            exportUrl="/api/customers/export"
            templateHeaders={['顧客名', 'フリガナ', '電話番号', 'メール', '誕生日', '性別', '初回来店日', '最終来店日', '来店回数', '累計金額', 'メモ']}
            templateFilename="customers_template.csv"
          />
        </div>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
