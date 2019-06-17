import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    StatusBar,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import { Icon } from 'native-base';
import config from '../config'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {
                first_name:'', 
                surname:'', 
                mail:'', 
                dob: '',
                gender:'' },
            token: null
        }
    }
    static navigationOptions = {
        drawerIcon : ({tintColor}) => (
            <Icon name="settings" style={{fontSize:24, color:tintColor}}/>
        )
    }

    handleLogout= async() => {
            await AsyncStorage.removeItem("jwt token", async() => 
            {
            console.log('logged out')
            this.props.navigation.navigate('Home')
            AsyncStorage.clear()
            console.log(await AsyncStorage.getItem("jwt token"))
            })
    }

    componentDidMount= async() => {
        
        const header = 'Bearer ' + await AsyncStorage.getItem('jwt token')
        console.log(header)
        axios.get(config.API_URL+'/api/account', {headers: {Authorization:header}})
          .then(res => {
              this.setState({
                  account:{
                      first_name:res.data.first_name,
                      surname: res.data.surname,
                      mail: res.data.mail,
                      dob: res.data.dob,
                      gender: res.data.gender
                  } 
              },() => {console.log('testing'), console.log(this.state.account)})
          }).catch(error => console.log(error))  
    }   
 
     

    


    render() {
        let user = this.state.account
        return (
            <ScrollView style={{flex: 1}}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                <Icon style={{color:'white', paddingRight:20, margin:15, position:'absolute'}} name="menu" onPress={() => this.props.navigation.openDrawer()}/>
                    <View style={{ height: 180, flex:1}}>

                    <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                    </View>         
                    <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={require('../content/img/profile.png')} />  
                    <View style={{ position:"absolute", top:80, left:150}}>
                        <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>Bouncer</Text>
                        <Text style={{color:'white', letterSpacing:3.02, fontWeight:'bold', fontSize:35,  fontFamily: 'montserrat.regular' }}>{user.first_name}</Text>
                    </View>
                   
                    </View>
                </LinearGradient>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                }}>
                    <View style={{borderRadius:6, elevation:4, marginTop:50, marginRight:30 ,marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                    <Text style={{paddingLeft:25, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>Algemene Informatie</Text>
                    <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>- {user.first_name} {user.surname}</Text>
                    <Text style={{paddingLeft:40, fontSize:10, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>- {user.mail}</Text>
                    <Text style={{paddingLeft:40, fontSize:10, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>- {user.dob}</Text>
                    <Text style={{paddingLeft:40, fontSize:10, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>- {user.gender}</Text>


                    </View>
                    <View style={{borderRadius:6 ,elevation:4,marginBottom:10, marginTop:20, marginRight: 30, marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                    <Text style={{padding:20, fontSize:12, color:'#9A9A9A', letterSpacing: 0.83, fontFamily: 'montserrat.regular' }}>Bijzonderheden</Text>
              
                    </View>
                    <LinearGradient colors={['#000000', '#434343']} 
                    style={{borderRadius:4, marginLeft:30, marginRight:30, paddingRight:20, marginTop:60, paddingBottom:0}}>
                        <Button onPress={this.handleLogout} title={"Uitloggen   >"} color="transparent" style={styles.buttonText }>
                        </Button>
                    </LinearGradient>
                </View>
               
            </ScrollView>
        )
    }

}

export default User;
var styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingLeft: 25,
      paddingRight: 15,
      borderBottomLeftRadius: 26,
      borderBottomRightRadius: 26,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'montserrat.regular',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
      },
  });