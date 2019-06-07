import React, {Component} from "react";
import { View, Text ,StyleSheet, SafeAreaView} from "react-native";
import {createDrawerNavigator, createAppContainer, DrawerItems} from 'react-navigation'
import Home from './components/Home'
import User from './components/User'
import { ScrollView } from "react-native-gesture-handler";
import Scanner from './components/Scanner'
import Hidden from './components/Hidden'

const Nav = createDrawerNavigator({
  Home:{
    screen:Home,
    navigationOptions: {
      drawerLabel: <Hidden />
    }},
  Scanner:Scanner,
  },
  {
    contentOptions:{
      activeTintColor:'black'
  }
});
const App = createAppContainer(Nav)

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex:1}}>    
    <ScrollView>
      <DrawerItems {...props}/>
    </ScrollView>
  </SafeAreaView>
)

export default App;

const styles = StyleSheet.create({
  container:{
    flex: 1, alignItems: "center", justifyContent: "center"
  }
})