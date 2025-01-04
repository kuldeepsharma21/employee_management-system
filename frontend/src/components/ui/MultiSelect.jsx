import React, { useState } from "react";

const MultiSelect = ({ options, selectedValues, onChange }) => {
  const [selected, setSelected] = useState(selectedValues);

  const handleSelect = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];

    setSelected(newSelected);
    onChange(newSelected); 
  };

  return (
    <div className="custom-multiselect">
      <label className="block text-sm font-medium text-gray-700">Employees</label>
      <div className="mt-2">
        {options.map((emp) => (
          <div key={emp._id} className="flex items-center">
            <input
              type="checkbox"
              id={emp._id}
              checked={selected.includes(emp._id)}
              onChange={() => handleSelect(emp._id)}
              className="mr-2"
            />
            <label htmlFor={emp._id}>
              {emp.firstName} {emp.lastName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
