import { FC, useEffect } from "react"
import { View, ViewStyle, StyleSheet, ScrollView, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
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
import type { AppStackScreenProps } from "@/navigators/AppNavigator" // @demo remove-current-line
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line
const { width } = Dimensions.get("window")
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
  const { themed } = useAppTheme()
  // @demo remove-block-start
  const { navigation } = _props
  const { logout } = useAuth()

  useEffect(() => {
    defaultAnim.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(-80, { duration: 1000 })), // forward
        withDelay(1500, withTiming(80, { duration: 1000 })), // backward
      ),
      -1,
      false,
    )
    progress.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(-80, { duration: 1000 })), // forward
        withDelay(1500, withTiming(80, { duration: 1000 })), // backward
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
      <ScrollView horizontal pagingEnabled contentContainerStyle={styles.contentContainer}>
        <View style={styles.viewContainer}>
          <Animated.View style={[styles.phoneBox, animatedLinear, animatedStyle]} />
          <Animated.View style={[styles.cardBox, animatedChanged]} />
        </View>
        <View style={styles.viewContainer}>
          <Animated.View style={[styles.phoneBox, animatedLinear, animatedStyle]} />
          <Animated.View style={[styles.cardBox, animatedChanged]} />
        </View>
      </ScrollView>
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
  contentContainer: {
    flexDirection: "row",
  },
  viewContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
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
