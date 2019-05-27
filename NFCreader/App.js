import React, {Component} from "react";
import { View, Text ,StyleSheet, SafeAreaView} from "react-native";
import {createDrawerNavigator, createAppContainer, DrawerItems} from 'react-navigation'
import MifareClassic from './components/MifareClassic'
import Home from './components/Home'
import TechTest from './components/TechTest'
import MultiNdef from './components/User'
import { ScrollView } from "react-native-gesture-handler";

const Nav = createDrawerNavigator({
  Home:Home,
  Mifare_Classic:MifareClassic,
  Gebruiker:MultiNdef},{
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