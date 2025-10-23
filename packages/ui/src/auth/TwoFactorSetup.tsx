import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Text } from '../typography/Text';
import { Heading } from '../typography/Heading';

interface TwoFactorSetupProps {
  qrCodeUrl: string;
  secret: string;
  backupCodes: string[];
  onVerify: (code: string) => Promise<boolean>;
  onComplete: () => void;
  onCancel: () => void;
}

export function TwoFactorSetup({
  qrCodeUrl,
  secret,
  backupCodes,
  onVerify,
  onComplete,
  onCancel,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await onVerify(verificationCode);
      if (isValid) {
        setShowBackupCodes(true);
        setStep('backup');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      {step === 'qr' && (
        <div>
          <Heading level={2} size="xl" style={{ marginBottom: '20px' }}>
            Set up Two-Factor Authentication
          </Heading>
          
          <Text style={{ marginBottom: '20px' }}>
            Scan this QR code with your authenticator app:
          </Text>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={qrCodeUrl}
              alt="2FA QR Code"
              style={{
                width: '200px',
                height: '200px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Text size="sm" color="muted">
              Or enter this secret key manually:
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            >
              <span style={{ flex: 1 }}>{secret}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(secret)}
              >
                Copy
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setStep('verify')}>
              Next: Verify Setup
            </Button>
          </div>
        </div>
      )}

      {step === 'verify' && (
        <div>
          <Heading level={2} size="xl" style={{ marginBottom: '20px' }}>
            Verify Setup
          </Heading>
          
          <Text style={{ marginBottom: '20px' }}>
            Enter the 6-digit code from your authenticator app:
          </Text>

          <Input
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            style={{ marginBottom: '16px' }}
          />

          {error && (
            <Text color="error" size="sm" style={{ marginBottom: '16px' }}>
              {error}
            </Text>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setStep('qr')}>
              Back
            </Button>
            <Button
              onClick={handleVerify}
              loading={isVerifying}
              disabled={!verificationCode || isVerifying}
            >
              Verify
            </Button>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div>
          <Heading level={2} size="xl" style={{ marginBottom: '20px' }}>
            Backup Codes
          </Heading>
          
          <Text style={{ marginBottom: '20px' }}>
            Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
          </Text>

          <div
            style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            >
              {backupCodes.map((code, index) => (
                <div key={index} style={{ padding: '4px' }}>
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
            >
              Copy All
            </Button>
            <Button onClick={handleComplete}>
              Complete Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}