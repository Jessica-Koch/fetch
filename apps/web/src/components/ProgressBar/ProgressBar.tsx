// apps/web/src/components/ProgressBar/ProgressBar.tsx
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  stepTitles,
}: ProgressBarProps) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Step Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          {stepTitles[currentStep]}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>

      {/* Step Dots (optional visual indicator) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          gap: '8px',
        }}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: index <= currentStep ? '#3b82f6' : '#e5e7eb',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
