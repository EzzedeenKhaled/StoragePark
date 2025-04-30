import { EllipsisVertical, CheckCircle2, Clock, XCircle } from 'lucide-react';

const TransactionHistory = () => {
  // Mock transaction data
  const transactions = [
    {
      id: 1,
      orderNumber: '0199',
      status: 'success',
      amount: '$421.00',
      date: 'Dec 23, 04:00 PM'
    },
    {
      id: 2,
      orderNumber: '0199',
      status: 'pending',
      amount: '$421.00',
      date: 'Dec 23, 04:00 PM'
    },
    {
      id: 3,
      orderNumber: '0199',
      status: 'failed',
      amount: '$421.00',
      date: 'Dec 23, 04:00 PM'
    },
    {
      id: 4,
      orderNumber: '0199',
      status: 'pending',
      amount: '$421.00',
      date: 'Dec 23, 04:00 PM'
    }
  ];

  // Status icons mapping
  const statusIcons = {
    success: (
      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
        <CheckCircle2 size={18} />
      </div>
    ),
    pending: (
      <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
        <Clock size={18} />
      </div>
    ),
    failed: (
      <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
        <XCircle size={18} />
      </div>
    )
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Transaction history</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {statusIcons[transaction.status]}
              <div>
                <p className="text-sm font-medium text-gray-700">Payment from #{transaction.orderNumber}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">{transaction.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory; 