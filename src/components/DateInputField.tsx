import React from 'react';

interface DateInputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  value,
  onChange,
  id,
  name,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={id || name}>{label}</label>
      <input
        type="date"
        id={id || name}
        name={name || id}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default DateInputField;
