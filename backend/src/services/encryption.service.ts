import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer | null;

  constructor(private configService: ConfigService) {
    // Don't throw during initialization - lazy load key
    // This prevents blocking app startup
    try {
      const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
      if (!encryptionKey) {
        console.warn('⚠️  ENCRYPTION_KEY not set - encryption features will be disabled');
        // Don't throw - allow app to start
        this.key = null;
      } else {
        // Ensure key is 32 bytes for AES-256
        this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
      }
    } catch (error) {
      console.warn('⚠️  Failed to initialize encryption key:', error.message);
      this.key = null;
    }
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    if (!this.key) {
      throw new Error('ENCRYPTION_KEY not set in environment');
    }
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as crypto.CipherGCM;

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return iv:authTag:encrypted
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    if (!this.key) {
      throw new Error('ENCRYPTION_KEY not set in environment');
    }
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv) as crypto.DecipherGCM;
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt account numbers (for display as ****1234)
   */
  encryptAccountNumber(accountNumber: string): {
    encrypted: string;
    lastFour: string;
  } {
    return {
      encrypted: this.encrypt(accountNumber),
      lastFour: accountNumber.slice(-4),
    };
  }

  /**
   * Encrypt financial data before storing
   */
  encryptFinancialData(data: any): string {
    return this.encrypt(JSON.stringify(data));
  }

  /**
   * Decrypt financial data after retrieving
   */
  decryptFinancialData(encryptedData: string): any {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }
}

