import SalesOverview from './components/SalesOverview';
import PurchaseOverview from './components/PurchaseOverview';
import InventorySummary from './components/InventorySummary';
import ProductSummary from './components/ProductSummary';
import TopSellingStock from './components/TopSellingStock';
import LowQuantityStock from './components/LowQuantityStock';
import SalesPurchaseChart from '../../Partner/components/SalesPurchaseChart';
import OrderSummaryChart from './components/OrderSummaryChart';
import RevenueChart from './components/RevenueChart';
const DashboardPage = () => {
  return (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* First Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Overview */}
          <SalesOverview />
          
          {/* Purchase Overview */}
          <PurchaseOverview />
          
          {/* Sales & Purchase Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Sales & Purchase</h2>
              <select className="px-3 py-1 border rounded-md text-gray-600">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <RevenueChart />
          </div>

          {/* Top Selling Stock */}
          <TopSellingStock />
        </div>

        {/* Second Column - 1/3 width */}
        <div className="space-y-6">
          {/* Inventory Summary */}
          <InventorySummary />
          
          {/* Product Summary */}
          <ProductSummary />
          
          {/* Order Summary Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            <OrderSummaryChart />
          </div>

          {/* Low Quantity Stock */}
          <LowQuantityStock />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 