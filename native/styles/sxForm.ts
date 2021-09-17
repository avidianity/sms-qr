import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width:'80%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center'
  },
  form: {
    width: '100%'
  },
  text1: {
    textAlign: 'center',
    color: '#777'
  },
  footerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingTop: 8
  },
  errorText: {
    fontSize: 10,
    color: 'red'
  }
})