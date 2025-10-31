import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Button, IconButton, useTheme, Text, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

interface ReceiptCaptureProps {
  visible: boolean;
  onClose: () => void;
  onReceiptCaptured: (imageUri: string) => void;
}

const { width, height } = Dimensions.get('window');

export const ReceiptCapture: React.FC<ReceiptCaptureProps> = ({
  visible,
  onClose,
  onReceiptCaptured,
}) => {
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    if (visible) {
      requestPermissions();
    }
  }, [visible]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    if (cameraStatus === 'granted' && mediaStatus === 'granted') {
      setHasPermission(true);
    } else {
      setHasPermission(false);
      Alert.alert(
        'Permissions Required',
        'Camera and media library permissions are required to capture receipts.',
        [{ text: 'OK', onPress: onClose }]
      );
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo?.uri) {
          // Save to media library
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          onReceiptCaptured(photo.uri);
          onClose();
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture receipt. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onReceiptCaptured(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  if (hasPermission === null) {
    return (
      <Portal>
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
          <View style={styles.permissionContainer}>
            <Text>Requesting camera permission...</Text>
          </View>
        </Modal>
      </Portal>
    );
  }

  if (hasPermission === false) {
    return (
      <Portal>
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
          <View style={styles.permissionContainer}>
            <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
            <Text style={styles.permissionText}>Camera access denied</Text>
            <Text style={styles.permissionSubtext}>
              Please enable camera permissions in your device settings to capture receipts.
            </Text>
            <Button mode="contained" onPress={onClose} style={styles.button}>
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    );
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.fullScreenModal}>
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.back}
            flashMode={flashMode}
            ratio="4:3"
          >
            {/* Header */}
            <View style={styles.header}>
              <IconButton
                icon="close"
                iconColor="#FFFFFF"
                size={32}
                onPress={onClose}
                style={styles.headerButton}
              />
              <Text style={styles.headerTitle}>Capture Receipt</Text>
              <IconButton
                icon={flashMode === FlashMode.off ? "flash-off" : "flash"}
                iconColor="#FFFFFF"
                size={32}
                onPress={toggleFlash}
                style={styles.headerButton}
              />
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Position the receipt within the frame and tap the capture button
              </Text>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <IconButton
                icon="image"
                iconColor="#FFFFFF"
                size={32}
                onPress={pickImageFromGallery}
                style={styles.controlButton}
              />
              
              <Button
                mode="contained"
                onPress={takePicture}
                disabled={isCapturing}
                style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.captureButtonContent}
              >
                {isCapturing ? 'Capturing...' : 'Capture'}
              </Button>

              <View style={styles.controlButton} />
            </View>
          </Camera>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  fullScreenModal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 16,
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    borderRadius: 40,
    elevation: 4,
  },
  captureButtonContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
