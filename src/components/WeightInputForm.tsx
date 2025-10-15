import React, { useState } from 'react';

interface WeightInputFormProps {
  onSubmit: (weight: number) => void;
}

const WeightInputForm: React.FC<WeightInputFormProps> = ({ onSubmit }) => {
  const [weight, setWeight] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    setError(null); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedWeight)) {
      setError('有効な数値を入力してください');
      setWeight('');
      return;
    }

    if (parsedWeight <= 0) {
      setError('体重は0より大きい値を入力してください');
      setWeight('');
      return;
    }

    onSubmit(parsedWeight);
    setWeight(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" role="form">
      <div>
        <label
          htmlFor="weight-input"
          className="block text-sm font-medium text-gray-700"
        >
          体重 (kg):
        </label>
        <input
          type="number"
          id="weight-input"
          value={weight}
          onChange={handleChange}
          placeholder="例: 15.5"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        記録
      </button>
    </form>
  );
};

export default WeightInputForm;
