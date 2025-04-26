// RequestCard.jsx
import React from 'react';

const RequestCard = ({ name, email, address, authorizedRepresentative, phoneNumber, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="space-y-1 text-sm text-gray-500">
            <p>{email}</p>
            <p>{address}</p>
            {authorizedRepresentative && (
              <p>Rep: {authorizedRepresentative}</p>
            )}
            {phoneNumber && (
              <p>Phone: {phoneNumber}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            New Request
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;