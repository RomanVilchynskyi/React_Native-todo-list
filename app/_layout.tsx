import { Stack } from "expo-router";
import { TodoProvider } from './context/TODOContext';
import { store } from "./slices/store";
import { Provider } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
   return (
    <Provider store={store}>
      <TodoProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TodoProvider>
    </Provider>
  );
}
