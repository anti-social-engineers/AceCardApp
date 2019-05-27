import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    StatusBar,
    StyleSheet,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import {Header, Left, Right} from 'react-base'
import { Icon } from 'native-base';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubcode: '',
            password:''
        }
    }
    static navigationOptions = {
        drawerIcon : ({tintColor}) => (
            <Icon name="home" style={{fontSize:24, color:tintColor}}/>
        )
    }

    render() {
        let { clubcode } = this.state;
        let { wachtwoord } = this.state;
        return (
            <ScrollView style={{flex: 1}}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                <Icon style={{color:'white', paddingRight:20, margin:15, position:'absolute', alignSelf: 'flex-end'}} name="menu" onPress={() => this.props.navigation.openDrawer()}/>
                <View style={{ height: 180,
                    flex:1, flexDirection:'column'}}>
                <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                </View> 
                <Text style={{color:'white', fontWeight:'bold', fontSize:30, marginTop:50, fontFamily: 'montserrat.regular' }}>Inloggen</Text>
                </View>
                </LinearGradient>
                <View
                style={{
                padding: 20,
                paddingTop:30,
                }}>     
                <TextField
                    label='Clubcode'
                    value={clubcode}
                    onChangeText={ (clubcode) => this.setState({ clubcode }) }
                />
                </View>
                <View
                style={{
                paddingLeft: 20,
                paddingRight: 20,
                }}>
                <TextField
                    label='Wachtwoord'
                    value={wachtwoord}
                    placeholder="*****************"
                    onChangeText={ (wachtwoord) => this.setState({ wachtwoord }) }
                />
                </View>
                <View style={{flex: 1, flexDirection: 'row', padding:35, paddingTop:100}}>
                <Text style={{fontFamily: 'montserrat.regular',paddingTop:10, fontSize:10, color:'black'}}>Wachtwoord vergeten?</Text>
                <LinearGradient colors={['#000000', '#434343']} 
                style={{borderRadius:4, marginLeft:30, paddingLeft:25, paddingRight:25, paddingTop:10, paddingBottom:10}}>
                <Text style={styles.buttonText }>
                Inloggen  >
                </Text>
                </LinearGradient>
                </View>
            </ScrollView>
        )
    }

}

export default Home;
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