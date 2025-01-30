import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'

const Home = () => {
    return (
      <Redirect href="/(auth)/welcome" />
    )
  
}

export default Home