import { useState, useRef } from "react";
import { StyleSheet, View, Platform } from "react-native";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";

const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const [status, requestPermission] = MediaLibrary.usePermissions();

  const imageRef = useRef();

  if (status === null) {
    requestPermission();
  }

  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then((dataUrl) => {
          let link = document.createElement("a");
          link.download = "sticker-smash.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            selectedImage={selectedImage}
            placeholderImageSource={PlaceholderImage}
          />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={120} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            theme="primary"
            onPress={pickImageAsync}
            label="Choose A Pic"
          />
          <Button
            label="Add Stickers To This Pic"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <StatusBar style="dark" />
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2cebb",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    marginTop:50,
    marginLeft: 0,
  },
  image: {
    width: 960,
    height: 1320,
    borderRadius: 10,
  },
  footerContainer: {
    flex: 1 / 4,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 30,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
