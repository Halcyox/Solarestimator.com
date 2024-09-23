import { useEffect, useState, useRef } from 'react';

export interface AddressInputProps {
  onSubmit(inputData: { address: string; bill: number }): void; // Now expects an object with address and bill
}

export const AddressInput = ({ onSubmit }: AddressInputProps): JSX.Element => {
  const [address, setAddress] = useState<string>('');
  const [bill, setBill] = useState<string>(''); // Bill is a string initially, will be converted to a number
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Get the Google Maps API key from the environment variables
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!googleApiKey) {
        console.error('Google API key is missing. Please add it to the .env.local file.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'us' },
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
              setAddress(place.formatted_address);
              setSelectedFromAutocomplete(true); // Mark as valid address
            }
          });
        }
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    }
  }, [googleApiKey]); // Ensure this effect runs when the API key changes

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFromAutocomplete) {
      alert('Please select a valid address from the suggestions.');
      return;
    }

    // Pass the address and bill as an object
    onSubmit({
      address,
      bill: Number(bill), // Convert the bill from string to number
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setSelectedFromAutocomplete(false); // Reset autocomplete flag if manually typing
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter your address"
        ref={inputRef}
        value={address}
        onChange={handleAddressChange}
        className={`input input-bordered w-full max-w-xs ${!selectedFromAutocomplete ? 'border-red-500' : ''}`}
        style={{
          transition: 'border-color 0.3s ease',
          borderColor: !selectedFromAutocomplete ? '#ff0000' : '#ced4da',
        }}
      />
      <input
        type="number"
        placeholder="Cost of most recent electric bill"
        value={bill}
        onChange={(e) => setBill(e.target.value)} // Update bill
        className="input input-bordered w-full max-w-xs"
      />
      <button type="submit" className="btn btn-primary">Calculate Cost</button>
    </form>
  );
};
