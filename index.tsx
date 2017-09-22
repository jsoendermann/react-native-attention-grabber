import * as React from 'react'
import { View, Animated, Easing, ViewStyle } from 'react-native'

export interface AttentionGrabberProps {
  style?: ViewStyle
  pulse?: boolean
  pulseDuration?: number
  pulseMagnitude?: number

  children?: any
}

export interface AttentionGrabberDefaultProps {
  style: ViewStyle
  pulse: boolean
  pulseDuration: number
  pulseMagnitude: number

  children?: any
}

type PropsWithDefaults = AttentionGrabberProps & AttentionGrabberDefaultProps

export interface AttentionGrabberState {
  pulse: Animated.Value
}

export default class AttentionGrabber extends React.Component<
  AttentionGrabberProps,
  AttentionGrabberState
> {
  state = {
    pulse: new Animated.Value(0.5),
  }

  static defaultProps: AttentionGrabberDefaultProps = {
    style: {},
    pulse: false,
    pulseDuration: 1000,
    pulseMagnitude: 0.05,
  }

  constructor(props: AttentionGrabberProps) {
    super(props)

    if (props.pulse) {
      this.startPulseAnimation()
    }
  }

  componentWillReceiveProps(newProps: AttentionGrabberProps) {
    if (!this.props.pulse && newProps.pulse) {
      this.startPulseAnimation()
    } else if (this.props.pulse && !newProps.pulse) {
      this.state.pulse.stopAnimation()
      this.state.pulse.setValue(0.5)
    }
  }

  private startPulseAnimation() {
    const { pulseDuration } = this.props as PropsWithDefaults

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.pulse, {
          toValue: 1,
          duration: pulseDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.pulse, {
          toValue: 0,
          duration: pulseDuration / 2,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  render() {
    const { pulseMagnitude, style } = this.props as PropsWithDefaults

    const scale = this.state.pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1 - pulseMagnitude, 1 + pulseMagnitude],
    })

    return (
      <Animated.View style={[style, { transform: [{ scale: scale }] }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}
