import { useState } from 'react';
import { StyleSheet, FlatList, Image, Platform, Pressable,Text } from 'react-native';

export default function EmojiList({ onSelect, onCloseModal }) {
  const [emoji] = useState([
    [require('../assets/images/fern.png'),"Fern"],
    [require('../assets/images/bella.png'),"Bella"],
    [require('../assets/images/ana.png'),"Ana"],
    [require('../assets/images/toco.png'),"Toco"],
    [require('../assets/images/marsh.png'),"Marsh"]
  ]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web' ? true : false}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => {
              onSelect(item[0]);
              onCloseModal();
            }}>
            <Image source={item[0]} key={index} style={styles.image} />
            <Text style={styles.text}>{item[1]}</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  text: {
    textAlign: "center"
  }
});