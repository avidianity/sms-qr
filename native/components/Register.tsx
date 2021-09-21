import React, { useState } from 'react';
import {  Alert, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { formStyles } from '../styles/sxForm';
import { FrontPageContainer } from './FrontPageContainer';
import { Formik } from 'formik';
import {API_URI, ENV} from '@env'
import * as yup from 'yup'
import { CapitalizeFirstLetter } from '../utils/string';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, User, UserResponse } from '../types';
import { useGlobalContext } from '../utils/GlobalContext';
import { phoneRegExp, strongPasswordExp } from '../utils/regex';
import axios, { AxiosResponse } from 'axios';
import { StatusBar } from 'expo-status-bar';
import PhoneInput from 'react-native-phone-number-input';
import {CountryCode} from 'react-native-phone-number-input/node_modules/react-native-country-picker-modal'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const passwordShape = yup
.string()
.min(8, ({ min }) => `Password must be at least ${min} characters`)
.matches(strongPasswordExp, 'Need strong password (at least one symbol, number and uppercase letter).')

const registerValidationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  password: passwordShape.required('Password is required.'),
  confirmpassword: passwordShape.required('Password is required.').when("password", {
    is: (val:string) => (val && val.length > 0 ? true:false),
    then: yup.string().oneOf(
      [yup.ref("password")],
      "Both password need to be the same"
    )
  }),
  name: yup.string().required('Name is required.'),
  number: yup.string().length(10)
})

const updateValidationSchema = yup.object().shape({
  email: yup.string().email(),
  password: passwordShape,
  confirmpassword: passwordShape.when("password", {
    is: (val:string) => (val && val.length > 0 ? true:false),
    then: yup.string().oneOf(
      [yup.ref("password")],
      "Both password need to be the same"
    )
  }),
  name: yup.string(),
  number: yup.string().length(10)
})

type Methods = 'add_teacher' | 'add_admin'

export function Register(props:NativeStackScreenProps<RootStackParamList, 'Update'>) {
  const [countryCode, setCountryCode] = useState<CountryCode>('PH')

  let user:User= props?.route?.params?.user || {}
  let method:Methods = props?.route?.params?.method

  const hasUser = Object.keys(user).length > 0
  const hasMethod = method?.length > 0

  const { token, setUser, setToken } = useGlobalContext(props)

  return (
    <FrontPageContainer bg={1}>
      <StatusBar style='dark' />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={formStyles.container}>
          <Text style={formStyles.header}>{
           hasUser ? 'Update Account' :
           method === 'add_teacher' ? 'Add Teacher' :
           method === 'add_admin' ? 'Add Admin' :
           'Create Account'
          }</Text>
          <View style={formStyles.form}>
            <Formik
              initialValues={{
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmpassword: '',
                number: user.number || ''
              }}
              validationSchema={hasUser ? updateValidationSchema : registerValidationSchema}
              onSubmit={(values, {setSubmitting})=> {
                let request:Promise<AxiosResponse<any>>

                //Remove unchanged to values
                let {confirmpassword ,...tmpValues} = {...values}

                Object.keys(values).forEach((key) => {
                  //@ts-ignore
                  if (values[key] === user[key] || values[key].length === 0) {
                    //@ts-ignore
                    delete tmpValues[key]
                  }
                })

                //transform number into 11 digit
                if (tmpValues.number) tmpValues.number = '0' + tmpValues['number']
                console.log(tmpValues.number)
                if (hasUser) {
                  request = axios.put(API_URI+'/teachers/'+user.id, tmpValues, {
                    headers: {'Authorization': `Bearer ${token}`}
                  })
                }
                else if (hasMethod && method === 'add_teacher') {
                  request = axios.post(API_URI+'/teachers', tmpValues, {
                    headers: {'Authorization': `Bearer ${token}`}
                  })
                }
                else if (hasMethod && method === 'add_admin') {
                  request = axios.post(API_URI+'/admins', tmpValues, {
                    headers: {'Authorization': `Bearer ${token}`}
                  })
                }
                else request = axios.post(API_URI+'/auth/register', tmpValues)

                request.then(async (res:AxiosResponse<UserResponse>)=> {
                  if (res.data?.message) {
                    Alert.alert("Form Error", res.data.message, [{text: 'Ok', style: 'cancel'}], {cancelable:true})
                  } else {
                    if (!hasUser && !hasMethod) {
                      //Save to session
                      await AsyncStorage.setItem('user', JSON.stringify(res.data.user))
                      await AsyncStorage.setItem('token', res.data.token)

                      //save to context
                      setUser(res.data.user)
                      setToken(res.data.token)
                    } else  {
                      props.navigation.goBack()
                    }
                  }
                  setSubmitting(false)
                }).catch((err:Error)=> {
                  Alert.alert(
                    "DEV | " + err.name,
                    err.stack, [{
                      text: 'Cancel',
                      style: 'cancel'
                    }], {
                      cancelable: true
                    }
                  )
                  setSubmitting(false)
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
                      errors.confirmpassword && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.confirmpassword)}</Text>
                    }
                    <Input
                      placeholder='Confirm Password'
                      secureTextEntry={true}
                      value={values.confirmpassword}
                      onBlur={handleBlur('confirmpassword')}
                      onChangeText={handleChange('confirmpassword')}
                      disabled={isSubmitting}
                    />
                    {
                      errors.number && <Text style={formStyles.errorText}>{CapitalizeFirstLetter(errors.number)}</Text>
                    }
                    <PhoneInput
                      placeholder='Phone Number'
                      value={values.number}
                      onChangeText={handleChange('number')}
                      disabled={isSubmitting}
                      defaultCode={countryCode}
                      containerStyle={{marginBottom: 12}}
                    />
                  <Button
                    title={
                      hasUser ? "Update" :
                      (hasMethod && method === 'add_teacher') ? "Submit" :
                      "Register"
                  }
                    onPress={()=>handleSubmit()}
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                  />
                  {
                    !user && (
                      <View style={formStyles.footerView}>
                        <Text style={formStyles.text1}>Already have an account?</Text>
                        <Button 
                          title="Login"
                          type='clear'
                          //@ts-expect-error
                          onPress={()=>props.navigation.navigate('Login')}
                          disabled={isSubmitting}
                        />
                      </View>
                    )
                  }
                </View>
              )
            }
          </Formik>
        </View>
      </View>
      </View>
    </FrontPageContainer>
  )
}