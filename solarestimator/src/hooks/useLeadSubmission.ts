import { useState } from 'react';

interface LeadData {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  estimatedSavings?: number;
}

interface UseLeadSubmission {
  isSubmitting: boolean;
  error: string | null;
  submitLead: (data: LeadData) => Promise<boolean>;
}

export function useLeadSubmission(): UseLeadSubmission {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLead = async (data: LeadData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit lead');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    submitLead,
  };
}
