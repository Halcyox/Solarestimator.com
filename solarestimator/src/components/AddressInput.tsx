import { useState } from 'react';

export interface AddressInputProps {
  onSubmit(address: string, bill: string): void;
}

export const AddressInput = ({ onSubmit }: AddressInputProps): JSX.Element => {
  const [address, setAddress] = useState<string>('');
  const [bill, setBill] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(address, bill);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <input
        type="number"
        placeholder="Cost of most recent electric bill"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <button type="submit" className="btn btn-primary">Calculate Cost</button>
    </form>
  );
};
