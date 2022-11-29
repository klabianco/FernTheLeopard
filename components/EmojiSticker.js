import { View, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  RotationGestureHandler,
  TapGestureHandler,
  PinchGestureHandler
} from "react-native-gesture-handler";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rStyle = useAnimatedStyle(() => {
    return {
        transform: [{scale: scale.value}],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      if (scaleImage.value) {
        scaleImage.value = scaleImage.value * 1.2;
      }
    },
  });

  const onPinch = useAnimatedGestureHandler({
    onActive: (event) => {
        scale.value = event.scale;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
      
      console.log("source",stickerSource);
      //console.log("context",context.startX);

      if(translateY.value < -110) translateY.value = -110; // top
      if(translateY.value > 245) translateY.value = 245; // bottom
      if(translateX.value > 200) translateX.value = 200; // right
      if(translateX.value < 0) translateX.value = 0; // left
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
        <PinchGestureHandler onGestureEvent={onPinch}>
        <Animated.View >
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[rStyle, imageStyle, { width: imageSize, height: imageSize }]}
          />
          </Animated.View>
        </PinchGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  );
}