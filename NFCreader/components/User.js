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


class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    static navigationOptions = {
        drawerIcon : ({tintColor}) => (
            <Icon name="person" style={{fontSize:24, color:tintColor}}/>
        )
    }
    render() {

        return (
            <ScrollView style={{flex: 1}}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                <Icon style={{color:'white', paddingRight:20, margin:15, position:'absolute', alignSelf: 'flex-end'}} name="menu" onPress={() => this.props.navigation.openDrawer()}/>
                    <View style={{ height: 180, flex:1}}>
                    <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                    </View>         
                    <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={require('../content/img/profile.png')} />  
                    <View style={{ position:"absolute", top:80, left:150}}>
                        <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>Gebruiker</Text>
                        <Text style={{color:'white', letterSpacing:3.02, fontWeight:'bold', fontSize:35,  fontFamily: 'montserrat.regular' }}>John Doe</Text>
                    </View>
                   
                    </View>
                </LinearGradient>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                }}>
                    <View style={{borderRadius:6 ,elevation:4, marginTop:50, marginRight:30 ,marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                    <Text style={{padding:20, fontSize:12, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>Algemene Informatie</Text>

                    </View>
                    <View style={{borderRadius:6 ,elevation:4,marginBottom:10, marginTop:20, marginRight: 30, marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                    <Text style={{padding:20, fontSize:12, color:'#9A9A9A', letterSpacing: 0.83, fontFamily: 'montserrat.regular' }}>Bijzonderheden</Text>
                    </View>
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