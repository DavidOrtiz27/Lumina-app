import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React, { useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler'
import { DrawerContext, DrawerContextType } from '../hooks/useDrawer'
import { CustomDrawerContent } from './CustomDrawerContent'

interface DrawerProviderProps {
  children: React.ReactNode
}

const DRAWER_WIDTH = 280
const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const [isOpen, setIsOpen] = useState(false)
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  const openDrawer = () => {
    setIsOpen(true)
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeDrawer = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: -DRAWER_WIDTH,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false)
    })
  }

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer()
    } else {
      openDrawer()
    }
  }

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent
      
      if (!isOpen && (translationX > 50 || velocityX > 500)) {
        openDrawer()
      } else if (isOpen && (translationX < -50 || velocityX < -500)) {
        closeDrawer()
      }
    }
  }

  const contextValue: DrawerContextType = {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }

  return (
    <DrawerContext.Provider value={contextValue}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          {/* Contenido principal */}
          <PanGestureHandler
            onHandlerStateChange={handleGestureStateChange}
            activeOffsetX={[-10, 10]}
            failOffsetY={[-50, 50]}
          >
            <View style={styles.container}>
              {children}
            </View>
          </PanGestureHandler>

          {/* Overlay */}
          {isOpen && (
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <Animated.View 
                style={[
                  styles.overlay,
                  { opacity: overlayOpacity }
                ]} 
              />
            </TouchableWithoutFeedback>
          )}

          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawer,
              { 
                backgroundColor: colors.background,
                transform: [{ translateX }] 
              }
            ]}
          >
            <CustomDrawerContent />
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </DrawerContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})