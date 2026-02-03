import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Securely stores and verifies a 4-digit app passcode.
/// Uses flutter_secure_storage and SHA-256 with salt (no plaintext storage).
class PasscodeService {
  static const _keyHash = 'fambudget_passcode_hash';
  static const _keySalt = 'fambudget_passcode_salt';
  static const _passcodeLength = 4;

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const int passcodeLength = _passcodeLength;

  /// Returns true if a passcode has been set.
  Future<bool> hasPasscode() async {
    final hash = await _storage.read(key: _keyHash);
    return hash != null && hash.isNotEmpty;
  }

  /// Sets a new passcode (hash + salt stored securely).
  Future<void> setPasscode(String pin) async {
    if (pin.length != _passcodeLength) return;
    final salt = _randomSalt();
    final hash = _hash(pin, salt);
    await _storage.write(key: _keySalt, value: salt);
    await _storage.write(key: _keyHash, value: hash);
  }

  /// Verifies the given pin; returns true if correct.
  Future<bool> verifyPasscode(String pin) async {
    if (pin.length != _passcodeLength) return false;
    final storedHash = await _storage.read(key: _keyHash);
    final storedSalt = await _storage.read(key: _keySalt);
    if (storedHash == null || storedSalt == null) return false;
    final computed = _hash(pin, storedSalt);
    return storedHash == computed;
  }

  /// Removes the stored passcode (e.g. from Settings).
  Future<void> clearPasscode() async {
    await _storage.delete(key: _keyHash);
    await _storage.delete(key: _keySalt);
  }

  String _randomSalt() {
    final r = Random.secure();
    final bytes = List<int>.generate(32, (_) => r.nextInt(256));
    return base64Url.encode(bytes);
  }

  String _hash(String pin, String salt) {
    final bytes = utf8.encode('$salt$pin');
    final digest = sha256.convert(bytes);
    return base64Url.encode(digest.bytes);
  }
}
