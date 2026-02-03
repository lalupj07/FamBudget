// Data Encryption Manager
class DataEncryptionManager {
    constructor(app) {
        this.app = app;
        this.encryptionKey = null;
    }

    async init() {
        await this.loadOrCreateKey();
    }

    // Generate or load encryption key
    async loadOrCreateKey() {
        let key = localStorage.getItem('fambudget_encryption_key');
        if (!key) {
            // Generate new key
            key = this.generateKey();
            localStorage.setItem('fambudget_encryption_key', key);
        }
        this.encryptionKey = key;
    }

    // Generate encryption key
    generateKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Simple encryption (for demo - use proper crypto in production)
    async encrypt(text) {
        if (!text) return text;
        
        try {
            // Using Web Crypto API
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            
            const key = await crypto.subtle.importKey(
                'raw',
                this.hexToBytes(this.encryptionKey),
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);

            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('Encryption error:', error);
            return text; // Fallback to plain text
        }
    }

    // Decrypt
    async decrypt(encryptedText) {
        if (!encryptedText) return encryptedText;
        
        try {
            const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
            const iv = combined.slice(0, 12);
            const encrypted = combined.slice(12);

            const key = await crypto.subtle.importKey(
                'raw',
                this.hexToBytes(this.encryptionKey),
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedText; // Return as-is if decryption fails
        }
    }

    // Helper: hex string to bytes
    hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    // Encrypt sensitive transaction data
    async encryptTransaction(transaction) {
        const sensitive = {
            description: transaction.description,
            notes: transaction.notes || ''
        };

        const encrypted = {
            ...transaction,
            description: await this.encrypt(sensitive.description),
            notes: await this.encrypt(sensitive.notes || ''),
            encrypted: true
        };

        return encrypted;
    }

    // Decrypt transaction
    async decryptTransaction(transaction) {
        if (!transaction.encrypted) return transaction;

        return {
            ...transaction,
            description: await this.decrypt(transaction.description),
            notes: await this.decrypt(transaction.notes || ''),
            encrypted: false
        };
    }
}

if (typeof window !== 'undefined') {
    window.DataEncryptionManager = DataEncryptionManager;
}
