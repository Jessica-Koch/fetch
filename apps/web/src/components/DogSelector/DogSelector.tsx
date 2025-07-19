// apps/web/src/components/DogSelector/DogSelector.tsx
import { useState, useEffect } from 'react';
import { Dog } from '@fetch/shared';
import { dogApi, isApiError } from '../../services/api';

interface DogSelectorProps {
  selectedDogs: Dog[];
  onSelectionChange: (dogs: Dog[]) => void;
  otherDogName: string;
  onOtherDogNameChange: (name: string) => void;
  required?: boolean;
  error?: string;
}

export const DogSelector = ({
  selectedDogs,
  onSelectionChange,
  otherDogName,
  onOtherDogNameChange,
  required = false,
  error,
}: DogSelectorProps) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const response = await dogApi.getAll();
        setDogs(response.data);
      } catch (err) {
        console.error('Failed to fetch dogs:', err);
        const errorMessage = isApiError(err)
          ? err.message
          : 'Failed to load dogs. Please try again.';
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const handleDogSelection = (dog: Dog, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedDogs, dog]);
    } else {
      onSelectionChange(selectedDogs.filter((d) => d.id !== dog.id));
    }
  };

  const handleOtherToggle = (checked: boolean) => {
    setShowOtherInput(checked);
    if (!checked) {
      onOtherDogNameChange('');
    }
  };

  const isDogSelected = (dog: Dog) => {
    return selectedDogs.some((d) => d.id === dog.id);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading available dogs...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div style={{ padding: '20px', color: '#ef4444' }}>
        <p>Error: {apiError}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <fieldset
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <legend
          style={{ fontSize: '16px', fontWeight: '600', padding: '0 8px' }}
        >
          Which dog(s) are you interested in adopting? {required && '*'}
        </legend>

        {/* Available Dogs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          {dogs.map((dog) => {
            const isSelected = isDogSelected(dog);
            const imageUrl = dog.photos?.[0] || '/placeholder-dog.jpg';
            const age =
              dog.age < 1 ? 'Less than a year old' : `${dog.age} years old`;

            return (
              <label
                key={dog.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: isSelected
                    ? '2px solid #3b82f6'
                    : '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type='checkbox'
                  checked={isSelected}
                  onChange={(e) => handleDogSelection(dog, e.target.checked)}
                  style={{ marginRight: '12px', width: '16px', height: '16px' }}
                />

                <img
                  src={imageUrl}
                  alt={dog.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    marginRight: '12px',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {dog.name}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '2px',
                    }}
                  >
                    {dog.breed} •{' '}
                    {dog.gender.toLowerCase() === 'male' ? 'Male' : 'Female'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {age}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Other Dog Option */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={showOtherInput}
              onChange={(e) => handleOtherToggle(e.target.checked)}
              style={{ marginRight: '8px', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: '500' }}>
              Other (dog not listed above or from another source)
            </span>
          </label>

          {showOtherInput && (
            <input
              type='text'
              placeholder="Enter the dog's name or description"
              value={otherDogName}
              onChange={(e) => onOtherDogNameChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          )}
        </div>

        {/* Selection Summary */}
        {(selectedDogs.length > 0 || otherDogName) && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                fontWeight: '600',
                marginBottom: '8px',
                color: '#0369a1',
              }}
            >
              Selected for Adoption:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#0369a1' }}>
              {selectedDogs.map((dog) => (
                <li key={dog.id} style={{ marginBottom: '4px' }}>
                  {dog.name} ({dog.breed})
                </li>
              ))}
              {otherDogName && (
                <li style={{ marginBottom: '4px' }}>{otherDogName} (other)</li>
              )}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
            {error}
          </div>
        )}
      </fieldset>
    </div>
  );
};
