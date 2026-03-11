import { Stack } from "expo-router";
import { TodoProvider } from './context/TODOContext';

export default function RootLayout() {
  return (
  <TodoProvider>
  <Stack>
    <Stack.Screen
        name="(tabs)"
        options={{ title: "Home", headerShown: false }}
      ></Stack.Screen>
  </Stack>
  </TodoProvider>);
}
