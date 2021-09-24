import React, { useRef } from "react";
import { Alert, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { formStyles } from "../styles/sxForm";
import { FrontPageContainer } from "./FrontPageContainer";
import { Formik } from "formik";
import { API_URI, ENV } from "@env";
import * as yup from "yup";
import { CapitalizeFirstLetter } from "../utils/string";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, UserResponse } from "../types";
import { useAuth } from "../utils/GlobalContext";
import { StatusBar } from "expo-status-bar";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

const loginValidationSchema = yup.object().shape({
  email: yup.string().email().required("Email is required."),
  password: yup.string().required("Password is required."),
});

export function Login(props: MaterialTopTabBarProps) {
  const { setToken } = useAuth();

  return (
    <FrontPageContainer bg={0}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={formStyles.container}>
          <Text style={formStyles.header}>Login Account</Text>
          <View style={formStyles.form}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                fetch(API_URI + "/auth/login", {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                  body: JSON.stringify(values),
                })
                  .then(async (res) => {
                    const body: UserResponse =
                      (await res.json()) as UserResponse;

                    if (body?.message) {
                      Alert.alert(
                        "Login Error",
                        body.message,
                        [{ text: "Ok", style: "cancel" }],
                        { cancelable: true }
                      );
                    } else {
                      //save to context
                      setToken(body.token);
                    }

                    setSubmitting(false);
                  })
                  .catch((err: Error) => {
                    if (ENV === "dev") {
                      Alert.alert(
                        "DEV | " + err.name,
                        err.message,
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                        ],
                        {
                          cancelable: true,
                        }
                      );
                      setSubmitting(false);
                    }
                  });
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                values,
                errors,
                isValid,
              }) => (
                <View>
                  {errors.email && (
                    <Text style={formStyles.errorText}>
                      {CapitalizeFirstLetter(errors.email)}
                    </Text>
                  )}
                  <Input
                    placeholder="Email"
                    value={values.email}
                    onBlur={handleBlur("email")}
                    onChangeText={handleChange("email")}
                    disabled={isSubmitting}
                    keyboardType="email-address"
                  />
                  {errors.password && (
                    <Text style={formStyles.errorText}>
                      {CapitalizeFirstLetter(errors.password)}
                    </Text>
                  )}
                  <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    value={values.password}
                    onBlur={handleBlur("password")}
                    onChangeText={handleChange("password")}
                    disabled={isSubmitting}
                  />

                  <Button
                    title="Login"
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                  />
                  <View style={formStyles.footerView}>
                    <Text style={formStyles.text1}>No account?</Text>
                    <Button
                      title="Register"
                      type="clear"
                      onPress={() => props.navigation.navigate("Register")}
                      disabled={isSubmitting}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </FrontPageContainer>
  );
}
