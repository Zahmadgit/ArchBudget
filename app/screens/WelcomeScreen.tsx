import { FC, useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, StyleSheet } from "react-native"

import Animated, {
  useSharedValue,
  withSpring,
  withRepeat,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolateColor,
} from "react-native-reanimated"

import { Button } from "@/components/Button" // @demo remove-current-line
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext" // @demo remove-current-line
import { isRTL } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/AppNavigator" // @demo remove-current-line
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { useHeader } from "@/utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface AppProps {
  width: number
}
const welcomeLogo = require("@assets/images/logo.png")
const welcomeFace = require("@assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line

// @demo replace-next-line export const WelcomeScreen: FC = function WelcomeScreen(
export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  const defaultAnim = useSharedValue<number>(100)
  const progress = useSharedValue(0)
  const animatedLinear = useAnimatedStyle(() => ({
    transform: [{ translateX: defaultAnim.value }],
  }))

  const animatedChanged = useAnimatedStyle(() => ({
    transform: [{ translateX: -defaultAnim.value }],
  }))
  const { themed, theme } = useAppTheme()
  // @demo remove-block-start
  const { navigation } = _props
  const { logout } = useAuth()

  useEffect(() => {
    defaultAnim.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(-110, { duration: 1000 })), // forward
        withDelay(1500, withTiming(100, { duration: 1000 })), // backward
      ),
      -1,
      false,
    )
    progress.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(-100, { duration: 1000 })), // forward
        withDelay(1500, withTiming(100, { duration: 1000 })), // backward
      ),
      -1,
      true,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], ["white", "black"])
    return { backgroundColor }
  })

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )
  // @demo remove-block-end

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  //the text component has a tx="" prop, well this is also for getting default strings from the translation en.ts files
  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <Animated.View style={[styles.phoneBox, animatedLinear, animatedStyle]} />
      <Animated.View style={[styles.cardBox, animatedChanged]} />

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>
        <Text tx="welcomeScreen:postscript" size="md" />
        {/* @demo remove-block-start */}
        <Button testID="next-screen-button" preset="reversed" onPress={goNext}>
          Get Started
        </Button>
        {/* @demo remove-block-end */}
      </View>
    </Screen>
  )
}

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "23%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const styles = StyleSheet.create({
  phoneBox: {
    height: 400,
    width: 200,
    borderWidth: 1,
    borderColor: "blue",
    position: "absolute",
    top: 0,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "white",
  },
  cardBox: {
    height: 250,
    width: 180,
    borderWidth: 1,
    borderColor: "blue",
    position: "absolute",
    top: 150,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "black",
  },
})
