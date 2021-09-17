import React from 'react';
import { ImageBackground, View } from 'react-native';
import { indexStyles } from '../styles/sxIndex';

interface IProps {
  children: any
  bg: 0 | 1
}

export function FrontPageContainer({children, bg}:IProps) {
  return (
    <View style={indexStyles.container}>
      <ImageBackground
        source={bg === 0 ? require('../assets/bg0.jpg') : require('../assets/bg1.jpg')}
        style={indexStyles.imageBg}
      >
        {children}
      </ImageBackground>
    </View>
  )
}