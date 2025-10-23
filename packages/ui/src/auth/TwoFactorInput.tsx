import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import { Text } from '../typography/Text';

interface TwoFactorInputProps {
  onSubmit: (code: string) => Promise<boolean>;
  onBackupCode?: (code: string) => Promise<boolean>;
  onCancel: () => void;
  method: 'totp' | 'sms';
  phoneNumber?: string;
  remainingAttempts?: number;
  isLoading?: boolean;
}

export function TwoFactorInput({
  onSubmit,
  onBackupCode,
  onCancel,
  method,
  phoneNumber,
  remainingAttempts = 3,
  isLoading = false,
}: TwoFactorInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const isValid = useBackupCode 
        ? await onBackupCode?.(code) || false
        : await onSubmit(code);

      if (!isValid) {
        setError(`Invalid ${useBackupCode ? 'backup' : 'verification'} code`);
        if (remainingAttempts <= 1) {
          setError('Too many failed attempts. Please try again later.');
        }
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setCode(value);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const toggleBackupCode = () => {
    setUseBackupCode(!useBackupCode);
    setCode('');
    setError('');
  };

  const getTitle = () => {
    if (useBackupCode) return 'Enter Backup Code';
    if (method === 'sms') return 'Enter SMS Code';
    return 'Enter Authenticator Code';
  };

  const getDescription = () => {
    if (useBackupCode) {
      return 'Enter one of your backup codes to access your account.';
    }
    if (method === 'sms') {
      return `We sent a 6-digit code to ${phoneNumber}. Enter it below:`;
    }
    return 'Enter the 6-digit code from your authenticator app:';
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
          }}
        >
          {useBackupCode ? '🔑' : method === 'sms' ? '📱' : '🔐'}
        </div>
        
        <Text size="lg" weight="semibold" style={{ marginBottom: '8px' }}>
          {getTitle()}
        </Text>
        
        <Text color="muted" size="sm">
          {getDescription()}
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            placeholder={useBackupCode ? 'Enter backup code' : '000000'}
            maxLength={useBackupCode ? 8 : 6}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '0.2em',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontFamily: 'monospace',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>

        {error && (
          <Text color="error" size="sm" style={{ marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </Text>
        )}

        {remainingAttempts > 0 && remainingAttempts < 3 && (
          <Text color="warning" size="sm" style={{ marginBottom: '16px', textAlign: 'center' }}>
            {remainingAttempts} attempts remaining
          </Text>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            type="submit"
            loading={isSubmitting || isLoading}
            disabled={!code.trim() || isSubmitting || isLoading}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>

          {onBackupCode && !useBackupCode && (
            <Button
              type="button"
              variant="ghost"
              onClick={toggleBackupCode}
              style={{ width: '100%' }}
            >
              Use Backup Code Instead
            </Button>
          )}

          {useBackupCode && (
            <Button
              type="button"
              variant="ghost"
              onClick={toggleBackupCode}
              style={{ width: '100%' }}
            >
              Use {method === 'sms' ? 'SMS' : 'Authenticator'} Code Instead
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            style={{ width: '100%' }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {method === 'sms' && !useBackupCode && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Text size="sm" color="muted">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={() => {
                // This would trigger resend SMS
                console.log('Resend SMS');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c3aed',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Resend
            </button>
          </Text>
        </div>
      )}
    </div>
  );
}