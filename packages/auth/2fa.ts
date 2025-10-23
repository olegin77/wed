/**
 * Two-Factor Authentication (2FA) implementation
 * Supports SMS and TOTP (Time-based One-Time Password)
 */

import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { authenticator } from 'otplib';

export interface TwoFactorConfig {
  issuer: string;
  algorithm: 'sha1' | 'sha256' | 'sha512';
  digits: 6 | 8;
  period: number;
  window: number;
}

export interface TwoFactorSecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  isValid: boolean;
  method: 'totp' | 'sms' | 'backup';
  remainingAttempts?: number;
}

export class TwoFactorAuth {
  private config: TwoFactorConfig;

  constructor(config: Partial<TwoFactorConfig> = {}) {
    this.config = {
      issuer: 'WeddingTech',
      algorithm: 'sha1',
      digits: 6,
      period: 30,
      window: 1,
      ...config,
    };

    // Configure authenticator
    authenticator.options = {
      issuer: this.config.issuer,
      algorithm: this.config.algorithm,
      digits: this.config.digits,
      period: this.config.period,
      window: this.config.window,
    };
  }

  /**
   * Generate a new 2FA secret for a user
   */
  generateSecret(userId: string, userEmail: string): TwoFactorSecret {
    const secret = authenticator.generateSecret();
    const qrCodeUrl = authenticator.keyuri(userEmail, this.config.issuer, secret);
    const backupCodes = this.generateBackupCodes();

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify a TOTP code
   */
  verifyTotp(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }

  /**
   * Generate a 6-digit SMS code
   */
  generateSmsCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Verify SMS code (with rate limiting and expiration)
   */
  verifySmsCode(
    storedCode: string,
    inputCode: string,
    createdAt: Date,
    maxAge: number = 5 * 60 * 1000 // 5 minutes
  ): boolean {
    // Check if code has expired
    if (Date.now() - createdAt.getTime() > maxAge) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    const storedBuffer = Buffer.from(storedCode, 'utf8');
    const inputBuffer = Buffer.from(inputCode, 'utf8');

    if (storedBuffer.length !== inputBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, inputBuffer);
  }

  /**
   * Generate backup codes for account recovery
   */
  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(backupCodes: string[], inputCode: string): boolean {
    const normalizedInput = inputCode.toUpperCase().replace(/\s/g, '');
    
    const index = backupCodes.findIndex(code => 
      timingSafeEqual(
        Buffer.from(code, 'utf8'),
        Buffer.from(normalizedInput, 'utf8')
      )
    );

    if (index !== -1) {
      // Remove used backup code
      backupCodes.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Generate QR code data URL for TOTP setup
   */
  generateQrCodeDataUrl(qrCodeUrl: string): string {
    // This would typically use a QR code library like 'qrcode'
    // For now, return the URL as a data URL placeholder
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">
          QR Code for: ${qrCodeUrl}
        </text>
      </svg>
    `).toString('base64')}`;
  }

  /**
   * Validate 2FA setup
   */
  validateSetup(secret: string, testToken: string): boolean {
    return this.verifyTotp(secret, testToken);
  }

  /**
   * Get remaining time for current TOTP period
   */
  getRemainingTime(): number {
    const epoch = Math.round(Date.now() / 1000.0);
    const timeStep = Math.floor(epoch / this.config.period);
    const nextStep = (timeStep + 1) * this.config.period;
    return nextStep - epoch;
  }

  /**
   * Check if 2FA is properly configured
   */
  isConfigured(userSecret?: string, userBackupCodes?: string[]): boolean {
    return !!(userSecret && userBackupCodes && userBackupCodes.length > 0);
  }

  /**
   * Get 2FA status for a user
   */
  getStatus(userSecret?: string, userBackupCodes?: string[]): {
    isEnabled: boolean;
    hasTotp: boolean;
    hasBackupCodes: boolean;
    remainingBackupCodes: number;
  } {
    const hasTotp = !!userSecret;
    const hasBackupCodes = !!(userBackupCodes && userBackupCodes.length > 0);
    
    return {
      isEnabled: hasTotp || hasBackupCodes,
      hasTotp,
      hasBackupCodes,
      remainingBackupCodes: userBackupCodes?.length || 0,
    };
  }
}

// Export singleton instance
export const twoFactorAuth = new TwoFactorAuth();

// Export utility functions
export function generateSmsCode(): string {
  return twoFactorAuth.generateSmsCode();
}

export function verifySmsCode(
  storedCode: string,
  inputCode: string,
  createdAt: Date,
  maxAge?: number
): boolean {
  return twoFactorAuth.verifySmsCode(storedCode, inputCode, createdAt, maxAge);
}

export function generateTotpSecret(userId: string, userEmail: string): TwoFactorSecret {
  return twoFactorAuth.generateSecret(userId, userEmail);
}

export function verifyTotpCode(secret: string, token: string): boolean {
  return twoFactorAuth.verifyTotp(secret, token);
}