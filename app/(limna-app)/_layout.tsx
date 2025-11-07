import { DrawerProvider } from '@/presentation/navigation/components/DrawerProvider'
import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <DrawerProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(home)/index" />
        <Stack.Screen name="qr/index" />
        <Stack.Screen name="info/index" />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="settings/index" />
      </Stack>
    </DrawerProvider>
  )
}