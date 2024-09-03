import { useState } from 'react';

export const QuoteRequestForm = (
  props: {
    readonly onQuoteRequest: (email: string) => void;
  }
): JSX.Element => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    props.onQuoteRequest(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <h3 className="text-xl font-semibold">Get Personalized Quotes</h3>
      <input
        type="email"
        placeholder="Enter your email for exact pricing"
        value={email}
        onChange={(e): void => setEmail(e.target.value)}
        className="w-full max-w-md"
        required
      />
      <button type="submit" className="w-full max-w-md">Request Quotes</button>
    </form>
  );
};