import React, { Fragment, useState } from "react";
import { User } from "../../types";
import {
  Avatar,
  Icon,
  Overlay,
  Text,
  Button,
  ButtonGroup,
  Divider,
} from "react-native-elements";
import { Card } from "react-native-elements";
import { AvatarText, CapitalizeFirstLetter } from "../../utils/string";
import { ToastAndroid, View } from "react-native";
import randomColor from "randomcolor";
import { NavigationHelpers } from "@react-navigation/native";
import axios from "axios";
import { API_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IProps {
  user: User;
  navigation: NavigationHelpers<any, any>;
  refetch(): void;
}

export function UserCard({ user, navigation, refetch }: IProps) {
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const roleString = CapitalizeFirstLetter(user.role.toLowerCase());

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Fragment>
      <Overlay
        isVisible={deleteVisible}
        onBackdropPress={() => setDeleteVisible(false)}
        overlayStyle={{ padding: 24 }}
      >
        <Text style={{ paddingBottom: 16, fontSize: 24, fontWeight: "bold" }}>
          Notice
        </Text>
        <Text style={{ paddingBottom: 24 }}>
          Do you really want to delete{" "}
          <Text style={{ fontWeight: "bold" }}>{user.name}</Text>?
        </Text>
        <Divider />
        <View style={{ flexDirection: "row" }}>
          <Button
            onPress={async () => {
              axios
                .delete(`${API_URI}/${user.role}s/${user.id}`, {
                  headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                      "token"
                    )}`,
                  },
                })
                .then((res) => {
                  ToastAndroid.show(
                    `Succcessfully deleted ${user.role.toLowerCase()} ${
                      user.name
                    }.`,
                    ToastAndroid.LONG
                  );
                  setVisible(false);
                  refetch();
                });
            }}
            title="Yes"
            containerStyle={{ flex: 0.5, margin: 8 }}
            type="clear"
          />
          <Button
            title="No"
            onPress={() => setDeleteVisible(false)}
            containerStyle={{ flex: 0.5, margin: 8 }}
            buttonStyle={{ backgroundColor: "#DC143C" }}
          />
        </View>
      </Overlay>

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ minWidth: 280, padding: 24 }}
      >
        <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 18 }}>
          {user.name}'s Options
        </Text>
        <Divider style={{ paddingVertical: 4 }} />
        <View style={{ marginTop: 12 }}>
          {user.role === "TEACHER" && (
            <Fragment>
              <Button
                title={`View Attendance`}
                containerStyle={{ marginBottom: 8 }}
                onPress={() => navigation.navigate("User", { user })}
                icon={<Icon name="visibility" size={24} color="white" />}
                buttonStyle={{ paddingVertical: 8 }}
                titleStyle={{ paddingHorizontal: 6 }}
              />
            </Fragment>
          )}
          <Button
            title={`Update ${roleString}`}
            containerStyle={{ marginBottom: 8 }}
            onPress={() =>
              navigation.navigate("Update", {
                user,
                method: `update_${roleString.toLowerCase()}`,
              })
            }
            icon={<Icon name="settings" size={24} color="white" />}
            buttonStyle={{ paddingVertical: 8 }}
            titleStyle={{ paddingHorizontal: 6 }}
          />
          <Button
            title={`Delete ${roleString}`}
            onPress={() => setDeleteVisible(true)}
            icon={<Icon name="delete" size={24} color="white" />}
            buttonStyle={{ backgroundColor: "#DC143C", paddingVertical: 8 }}
            titleStyle={{ paddingHorizontal: 6 }}
          />
        </View>
      </Overlay>
      <TrueUserCard user={user} toggleOverlay={toggleOverlay} />
    </Fragment>
  );
}

interface JProps {
  user: Partial<User>;
  toggleOverlay?(): void;
}

export const TrueUserCard = ({ user, toggleOverlay }: JProps) => {
  const [avatarColor] = useState(randomColor({ luminosity: "dark" }));

  return (
    <Card containerStyle={{ borderRadius: 8, minHeight: 82 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Avatar
          rounded
          title={AvatarText(user.name)}
          size="medium"
          overlayContainerStyle={{ backgroundColor: avatarColor }}
          containerStyle={{ marginRight: 8 }}
        />
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{user.name}</Text>
          <Text style={{ color: "#555" }}>{user.email}</Text>
        </View>
        {toggleOverlay && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Button
              icon={<Icon name="list" size={24} color="white" />}
              onPress={toggleOverlay}
              buttonStyle={{ borderRadius: 999 }}
              containerStyle={{ borderRadius: 999 }}
            />
          </View>
        )}
      </View>
      <View style={{ marginVertical: 12 }}>
        <Card.Divider />
        <Text>
          <Text style={{ fontWeight: "bold" }}>Email:</Text> {user.email}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Phone Number:</Text>{" "}
          {user.number}
        </Text>
      </View>
    </Card>
  );
};
