import { Fragment, useState } from "react";
import { Listbox, ListboxButton, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const colors = [
  { name: "Forest Green", value: "green" },
  { name: "Black", value: "black" },
  { name: "Navy", value: "navy" },
];

const sizes = [
  { name: "Small", value: "s" },
  { name: "Medium", value: "m" },
  { name: "Large", value: "l" },
  { name: "X-Large", value: "xl" },
];

const Dropdown = ({ label, options, selected, setSelected, placeholder }) => (
  <div>
    <label className="text-sm text-gray-600 block mb-2">{label}</label>
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-black">
          <span className="block truncate">
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
            {options.map((option) => (
              <ListboxOptions
                key={option.value}
                value={option}
                className={({ active }) =>
                  `cursor-default select-none py-2 px-4 ${
                    active ? "bg-gray-100 text-black" : "text-gray-700"
                  }`
                }
              >
                {option.name}
              </ListboxOptions>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  </div>
);

const ProductDetails = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Polar Default Hoodie</h1>
        <p className="text-2xl">99.99 $</p>
      </div>

      <div className="space-y-4">
        <Dropdown
          label="Primary color"
          options={colors}
          selected={selectedColor}
          setSelected={setSelectedColor}
          placeholder="Select a color"
        />
        <Dropdown
          label="Size"
          options={sizes}
          selected={selectedSize}
          setSelected={setSelectedSize}
          placeholder="Select a size"
        />

        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
          Add to cart
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <button className="flex items-center justify-between w-full py-2">
            <span className="font-medium">Description</span>
            <ChevronDown size={16} />
          </button>
          <div className="pt-2 space-y-2 text-gray-600 text-sm">
            <p>✦ Designed by Adrian</p>
            <p>🇬🇧 MADE IN ENGLAND</p>
            <p>🧵 Materials: 70% cotton, 30% polyester</p>
            <p>
              Fleece Fabric, 310 gsm, Soft brushed inside, Metal Eyelets, Round Cotton String,
              Script Logo Embroidery, Raglan Sleeves, Regular Fit
            </p>
          </div>
        </div>

        <div>
          <button className="flex items-center justify-between w-full py-2">
            <span className="font-medium">Shipping and return policies</span>
            <ChevronDown size={16} />
          </button>
          <div className="pt-2 space-y-2 text-gray-600 text-sm">
            <p>📅 Order today to get by Dec 17-26</p>
            <p>🔄 Exchanges accepted within 14 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
