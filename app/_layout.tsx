import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {
  useEffect(() => {
    // Change Android navigation bar color
    NavigationBar.setBackgroundColorAsync("#030014"); // your color
  }, []);
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
