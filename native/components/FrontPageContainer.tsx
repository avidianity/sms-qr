import React from 'react';
import { ImageBackground, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { indexStyles } from '../styles/sxIndex';

interface IProps {
  children: any
  bg: 0 | 1
  onSafeArea?: boolean
}

export function FrontPageContainer({children, bg, onSafeArea}:IProps) {
  const child = (
    
    <ImageBackground
      source={bg === 0 ? require('../assets/bg0.jpg') : require('../assets/bg1.jpg')}
      style={indexStyles.imageBg}
    >
      {children}
    </ImageBackground>
    
  )
  
  if (onSafeArea) return <SafeAreaView style={indexStyles.container} children={child}/>
  else return <View style={indexStyles.container} children={child} />
}