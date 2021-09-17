import React, { useRef } from 'react';
import {  Alert, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { formStyles } from '../styles/sxForm';
import { FrontPageContainer } from './FrontPageContainer';
import { Formik } from 'formik';
import {API_URI, ENV} from '@env'
import * as yup from 'yup'
import { CapitalizeFirstLetter } from '../utils/capitalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, UserResponse } from '../types';
import { useGlobalContext } from '../utils/GlobalContext';
import { phoneRegExp } from '../utils/regex';
import axios, { AxiosResponse } from 'axios';

const registerValidationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  password: yup.string().min(6, ({ min }) => `Password must be at least ${min} characters`).required('Password is required.'),
  name: yup.string().required('Name is required.'),
  number: yup.string().matches(phoneRegExp, 'Phone number is not valid.')
})



export function Register(props:any) {
  const { setUser, setToken } = useGlobalContext()
  return (
    <FrontPageContainer bg={1}>
      <View style={formStyles.container}>
        <Text style={formStyles.header}>Create Account</Text>
        <View style={formStyles.form}>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              number: ''
            }}
            validationSchema={registerValidationSchema}
            onSubmit={(values, {setSubmitting})=> {
              
              axios.post(API_URI+'/auth/register', values).then(async (res:AxiosResponse<UserResponse>)=> {
                if (res.data?.message) {
                  Alert.alert("Register Error", res.data.message, [{text: 'Ok', style: 'cancel'}], {cancelable:true})
                } else {
                  //Save to session
                  await AsyncStorage.setItem('user', JSON.stringify(res.data.user))
                  await AsyncStorage.setItem('token', res.data.token)

                  //save to context
                  setUser(res.data.user)
                  setToken(res.data.token)
                }
              }).catch((err:Error)=> {
                if (ENV === 'dev') {
                  Alert.alert(
                    "DEV | " + err.name,
                    err.message, [{
                      text: 'Cancel',
                      style: 'cancel'
                    }], {
                      cancelable: true
                    }
                  )
                  setSubmitting(false)
                }
              })
            }}
          >
            {
              ({handleChange, handleBlur, handleSubmit, isSubmitting, values, errors, isValid}) => (
                <View>
                  {
                    errors.name && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.name)}</Text>
                  }
                  <Input
                    placeholder='Full Name'
                    value={values.name}
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    disabled={isSubmitting}
                  />
                  {
                    errors.email && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.email)}</Text>
                  }
                  <Input
                    placeholder='Email'
                    value={values.email}
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    disabled={isSubmitting}
                    keyboardType='email-address'
                  />
                  {
                    errors.password && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.password)}</Text>
                  }
                  <Input
                    placeholder='Password'
                    secureTextEntry={true}
                    value={values.password}
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    disabled={isSubmitting}
                  />
                  {
                    errors.number && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.number)}</Text>
                  }
                  <Input
                    placeholder='Phone Number'
                    value={values.number}
                    onBlur={handleBlur('number')}
                    onChangeText={handleChange('number')}
                    disabled={isSubmitting}
                  />
                  

                  
                  <Button
                    title="Register"
                    onPress={()=>handleSubmit()}
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                  />
                  <View style={formStyles.footerView}>
                    <Text style={formStyles.text1}>Already have an account?</Text>
                    <Button 
                      title="Login"
                      type='clear'
                      onPress={()=>props.navigation.navigate('Login')}
                      disabled={isSubmitting}
                    />
                  </View>
                </View>
              )
            }
          </Formik>
        </View>
      </View>
    </FrontPageContainer>
  )
}