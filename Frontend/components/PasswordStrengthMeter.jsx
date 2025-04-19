import { Check, X } from "lucide-react";

const PasswordStrengthMeter = ({ password }) => {
	const PasswordCriteria = ({ password }) => {
		const criteria = [
			{ label: "At least 8 characters", met: password.length >= 8 },
			{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
			{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
			{ label: "Contains a number", met: /\d/.test(password) },
			{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
		];
	
		return (
			<div className='mt-2 space-y-1'>
				{criteria.map((item) => (
					<div key={item.label} className='flex items-center text-xs'>
						{item.met ? (
							<Check className='size-4 text-orange-500 mr-2' />
						) : (
							<X className='size-4 text-gray-500 mr-2' />
						)}
						<span className={item.met ? "text-orange-500" : "text-gray-400"}>{item.label}</span>
					</div>
				))}
			</div>
		);
	};
  
	return (
	  <div className='mt-2 w-full'> {/* Full width */}
		<div className='flex justify-between items-center mb-1'>
		  <span className='text-sm text-gray-400'>Password strength</span> {/* Increased text size */}
		  <span className='text-sm text-gray-400'>{getStrengthText(strength)}</span> {/* Increased text size */}
		</div>
  
		<div className='flex space-x-1 w-full'>
		  {[...Array(4)].map((_, index) => (
			<div
			  key={index}
			  className={`h-2 flex-1 rounded-full transition-colors duration-300 
				  ${index < strength ? getColor(strength) : "bg-gray-600"}
				`}
			/>
		  ))}
		</div>
		<PasswordCriteria password={password} />
	  </div>
	);
  };
  
  export default PasswordStrengthMeter;