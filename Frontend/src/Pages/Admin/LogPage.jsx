import { useEffect, useState } from 'react';
import { Clock, Search, RefreshCw } from 'lucide-react';
import axios from '../../../lib/axios';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const LogItem = ({ log }) => {
  // Custom color palette: orange, dark, blue
const getBgColor = (action) => {
  if (
    [
      "Placed Order",
      "Set Discount",
      "Toggle On",
      "Toggle Off",
      "New Product"
    ].includes(action)
  ) return 'bg-[#FF8B13]/20'; // Orange (light)

  if (
    [
      "Accept",
      "Reject",
      "Reset Warehouse",
      "Remove Reservation"
    ].includes(action)
  ) return 'bg-[#1D2126]/20'; // Dark (light)

  if (action === "Unauthorized Access") return 'bg-red-100'; // Light red

  // Default: blue
  return 'bg-[#1479FF]/20'; // Blue (light)
};

  // Show user email or name if available (after populate)
  const userDisplay =
    typeof log.user === 'object'
      ? log.user?.email || log.user?.firstName || log.user?.lastName || log.user?._id
      : log.user;

  return (
    <div className={`p-3 mb-2 rounded-lg ${getBgColor(log.action)} flex justify-between items-center`}>
      <div className="flex-1">
        <p className="font-medium">{log.action}</p>
        <p className="text-sm text-gray-600">{userDisplay}</p>
        {/* Show details for all relevant actions */}
        {[
          "Placed Order",
          "Set Discount",
          "Toggle On",
          "Toggle Off",
          "New Product",
          "Accept",
          "Reject",
          "Reset Warehouse",
          "Remove Reservation",
          "Unauthorized Access"
        ].includes(log.action) && log.details && (
          <p className="text-xs text-gray-500 mt-1">{log.details}</p>
        )}
      </div>
      <div className="flex items-center text-gray-500">
        <Clock size={14} className="mr-1" />
        <span className="text-sm">{formatDate(log.date)}</span>
      </div>
    </div>
  );
};

const LogSection = ({ title, logs, filterText }) => {
  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(filterText.toLowerCase()) ||
    (typeof log.user === 'object'
      ? (log.user?.email || log.user?.firstName || log.user?.lastName || '').toLowerCase().includes(filterText.toLowerCase())
      : (log.user || '').toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-1">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => <LogItem key={log._id || log.id} log={log} />)
        ) : (
          <p className="text-gray-500 py-4 text-center">No logs found matching your filter.</p>
        )}
      </div>
    </div>
  );
};

export default function LogPage() {
  const [activeTab, setActiveTab] = useState('customer');
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState({ customer: [], partner: [], admin: [] });

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/admins/logs');
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Log Management Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center bg-[#FF8B13] cursor-pointer text-white px-4 py-2 rounded-md"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Refreshing..." : "Refresh Logs"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logs by action or user..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['customer', 'partner', 'admin'].map(tab => (
            <button
              key={tab}
              className={`py-2 px-4 cursor-pointer font-medium ${activeTab === tab
                ? 'text-[#FF8B13] border-b-2 border-[#FF8B13]'
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Logs
            </button>
          ))}
        </div>

        {/* Log Section */}
        {activeTab === 'customer' && (
          <LogSection title="Customer Activity Logs" logs={logs.customer} filterText={searchText} />
        )}
        {activeTab === 'partner' && (
          <LogSection title="Partner Activity Logs" logs={logs.partner} filterText={searchText} />
        )}
        {activeTab === 'admin' && (
          <LogSection title="Admin Activity Logs" logs={logs.admin} filterText={searchText} />
        )}
      </div>
    </div>
  );
}