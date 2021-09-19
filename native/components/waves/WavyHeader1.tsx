import React from 'react'
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function WavyHeader1() {
  return (
    <View style={{width: '100%'}}>
      <Svg
        viewBox="0 0 1440 320"
        style={{height: 80}}
      >
        <Path fill="#f37335" fill-opacity="1" d="M0,224L48,218.7C96,213,192,203,288,170.7C384,139,480,85,576,90.7C672,96,768,160,864,160C960,160,1056,96,1152,101.3C1248,107,1344,181,1392,218.7L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></Path>
      </Svg>
    </View>
  );
}