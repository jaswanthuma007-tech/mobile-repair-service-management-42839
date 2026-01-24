import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadBookingDraft, updateBookingDraft } from '../../lib/bookingSession';
import { Alert, Button, TextArea } from '../../ui/tw';
import { BookingStepProgress } from '../../ui/bookingFlow';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const ISSUES = [
  'Screen broken',
  'Battery problem',
  'Charging issue',
  'Speaker issue',
  'Camera issue',
  'Network issue',
  'Other'
];

// PUBLIC_INTERFACE
export default function SelectIssuePage() {
  /** Step 3: Choose a common issue (or enter custom when "Other"). */
  const navigate = useNavigate();
  const draft = useMemo(() => loadBookingDraft(), []);

  const brandName = draft?.brand?.name || '';
  const modelName = draft?.model?.model_name || '';

  const [selectedIssue, setSelectedIssue] = useState(draft?.issue?.value || '');
  const [otherText, setOtherText] = useState(draft?.issue?.otherText || '');

  const [errorMsg, setErrorMsg] = useState('');

  const effectiveIssue = useMemo(() => {
    if (selectedIssue === 'Other') return otherText.trim();
    return selectedIssue.trim();
  }, [selectedIssue, otherText]);

  const onContinue = () => {
    setErrorMsg('');

    if (!brandName || !modelName) {
      setErrorMsg('Missing brand/model selection. Please restart booking.');
      return;
    }

    if (!selectedIssue) {
      setErrorMsg('Please select an issue.');
      return;
    }

    if (selectedIssue === 'Other' && !otherText.trim()) {
      setErrorMsg('Please describe the issue.');
      return;
    }

    updateBookingDraft({
      issue: { value: selectedIssue, otherText: otherText.trim(), effective: effectiveIssue }
    });

    navigate('/confirm-booking');
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-2xl font-black tracking-tight">Select issue</h1>
        <p className="max-w-3xl text-sm text-ocean-muted">
          Device:{' '}
          <span className="font-semibold text-ocean-text">
            {brandName} {modelName}
          </span>
        </p>
      </div>

      <BookingStepProgress currentStep="issue" />

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ISSUES.map(issue => {
          const active = selectedIssue === issue;
          return (
            <button
              key={issue}
              type="button"
              onClick={() => setSelectedIssue(issue)}
              className={cn(
                'rounded-2xl border bg-white px-4 py-4 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
                'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
                active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
              )}
              aria-pressed={active ? 'true' : 'false'}
            >
              <div className="text-sm font-extrabold tracking-tight text-ocean-text">{issue}</div>
              <div className="mt-1 text-xs text-ocean-muted">Tap to select</div>
            </button>
          );
        })}
      </div>

      {selectedIssue === 'Other' ? (
        <TextArea
          label="Describe the issue"
          value={otherText}
          onChange={setOtherText}
          placeholder="e.g., phone heats up, random restarts, microphone not working…"
          required
          rows={4}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/select-model?brand=' + encodeURIComponent(brandName))}>
          Back
        </Button>

        <Button onClick={onContinue} disabled={!effectiveIssue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
