export default {
  name: "SMS-QR",
  version: "1.0.0",
  extra: {
    SERVER_API: process.env.API_URI || "http://192.168.254.100:5000",
    ENVIRONMENT: process.env.env || "dev",
  },
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
};
