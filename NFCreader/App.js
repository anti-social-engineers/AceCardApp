import React, {Component} from "react";
import { View, Text ,StyleSheet, SafeAreaView} from "react-native";
import {createDrawerNavigator, createAppContainer, DrawerItems} from 'react-navigation'
import Home from './components/Home'
import MultiNdef from './components/User'
import { ScrollView } from "react-native-gesture-handler";
import API from './components/API'
import Scanner from './components/Scanner'
const Nav = createDrawerNavigator({
  Home:Home,
  Scanner:Scanner,
  Gebruiker:MultiNdef},
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