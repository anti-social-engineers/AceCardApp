import React, { Component } from 'react';
//Styles
import {
    View,
    Text,
    Button,
    StatusBar,
    StyleSheet,
    Platform,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';

//http client
import axios from 'axios';

//local storage
import AsyncStorage from '@react-native-community/async-storage'

//components
import User from '../components/User'
import config from '../config'
import Loader from './Loader'

class Home extends Component {
    constructor(props) {
        super(props);
    
     this.state = {
            email: '',
            password:'',
            account: {email: "", password: ""},
            cache: null,
            isLogged: false,
            user: {
                first_name:'', 
                surname:'', 
                mail:'', 
                dob: '',
                gender:'',
                imagePath:'',
                role:''
            },
            image:null,
            error: null,
            loaded: false,
            decodeToken: null
        }
        Loader.load(v => this.setState({loaded:true}))
    }


    handleChange = (e) => {
        this.setState({
           account:{email:this.state.email, password:this.state.password}}
        )
    } 
    
    handleLogout= async() => {
        await AsyncStorage.removeItem("jwt token", async() => 
        {
        console.log('logged out')
        AsyncStorage.clear() 
        this.setState({isLogged: false})
        })
    }      

    sendData(user) {
       return <div><User user={user}/></div> 
    }

    handleSubmit = () => {
        this.setState({loaded:false ,account:{email:this.state.email, password:this.state.password}}, () => {
            axios.post(
            config.API_URL+'/api/login',
            this.state.account
            )
            .then(result => {
                this.setState({
                    cache:result.data.jsonWebToken,
                    error:''
                        
                },
                    async() => {
                        await AsyncStorage.setItem('jwt token', this.state.cache)
                        let token = await AsyncStorage.getItem('jwt token')
                        const header = 'Bearer ' + await AsyncStorage.getItem('jwt token')
                        axios.get(config.API_URL+'/api/account', {headers: {Authorization:header}})
                          .then(res => {
                                console.log(res)
                            if(res.data.role == 'sysop'){
                                
                              this.setState({
                                  error: '',
                                  user:{
                                      first_name:res.data.first_name,
                                      surname: res.data.surname,
                                      mail: res.data.mail,
                                      dob: res.data.dob,
                                      gender: res.data.gender,
                                      imagePath: res.data.image,
                                      role: res.data.role
                                  },
                                },
                                () => {
                                    console.log(this.state.user)
                                    console.log('testing')
                                    axios.get(config.API_URL+'/' + this.state.user.imagePath, {headers: {Authorization:header}, responseType:"blob"})
                                        .then(response => {
                                            console.log(response)
                                            const blob = response.data
                                            const fileReaderInstance = new FileReader();
                                            fileReaderInstance.readAsDataURL(blob); 
                                            fileReaderInstance.onload = () => {
                                                const base64data = fileReaderInstance.result;                
                                                this.setState({image: base64data})
                                                console.log(this.state.image)
                                            }
 
                                        })
                                        .catch(err => console.log(err));
                                    this.setState({isLogged: true, loaded: true})                   
                                    
                                })
                          }
                        else{
                            console.log('test123')
                            this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>U heeft geen recht om in te loggen!</Text> })
                        }}
                          ).catch(err => console.log(err)) 
                    }
                )
            }) .catch((error) => {
                console.log('handling error');
                console.log(error);
                if(error == 'Error: Request failed with status code 401'){
                    console.log('handling 401');
                    this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>email en wachtwoord komen niet overeen!</Text> })
                }
                if(error == 'Error: Request failed with status code 403'){
                    console.log('handling 403');
                    this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>Uw account is nog niet geactiveerd!</Text> })
                }
                if(error == 'Error: Request failed with status code 500'){
                    console.log('handling 500');
                    this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>Er is iets mis met de server!</Text> })
                }
                if(error == 'Error: Request failed with status code 422'){
                    console.log('handling 500');
                    this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>Onjuist e-mail adress</Text> })
                }
                if(error == 'Error: Request failed with status code 404'){
                    console.log('handling 404');
                    this.setState({loaded: true, error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular'}}>Er is iets mis met de server!</Text> })
                }
              })
         
         })
 
            
         //    if(this.state.cache != null){
                //     let get = await AsyncStorage.setItem('jwt token', "test")
                //     let get = await AsyncStorage.getItem('jwt token')
                //     console.log('testing')
                //    }
                //  response.data.jsonWebToken
        
            // if(AsyncStorage.getItem('jwt token') != null) {
            //     this.props.navigation.navigate('User')
            // } 
    
    }

    render() {
        let { email } = this.state;
        let { password } = this.state;
        let { error } = this.state;
        let {image} = this.state;

        return (
            <ScrollView style={{flex: 1}}>
                
                {this.state.loaded ? <View>
                        {this.state.isLogged ? 
                    
                            <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}> 
                                <View style={{ height: 180, flex:1}}>
                                <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                                </View>         
                                <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={{uri: image}} />
                                <View style={{ position:"absolute", top:80, left:150}}>
                                    <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>{this.state.user.role}</Text>
                                    <Text style={{color:'white', letterSpacing:3.02, fontWeight:'bold', fontSize:35,  fontFamily: 'montserrat.regular' }}>{this.state.user.first_name}</Text>
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
                                <Text style={{paddingLeft:25, paddingRight:5, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>U bent een {this.state.user.role}</Text>
                                <Text style={{paddingLeft:40, paddingRight:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>Omdat u een {this.state.user.role} bent, heeft u het recht om de ace kaart te scannen van mensen die consumeren in uw vestiging. </Text>
                            </View> 

                            <LinearGradient colors={['#000000', '#434343']} 
                            style={{borderRadius:4, marginLeft:30, marginRight:30, paddingTop:0, paddingBottom:0}}>
                            <Button onPress={() => this.props.navigation.navigate('Scanner')} title={"Begin met scannen"} color="transparent" style={styles.buttonText }>
                            </Button>
                            </LinearGradient>

                            <View style={{borderRadius:6, elevation:4, marginTop:50, marginRight:30 ,marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                                <Text style={{paddingLeft:25, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>Algemene Informatie</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>naam: {this.state.user.first_name} {this.state.user.surname}</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>email: {this.state.user.mail}</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>geboortedatum: {this.state.user.dob}</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>geslacht {this.state.user.gender}</Text> 
                            </View>
                              
                            <LinearGradient colors={['#000000', '#434343']} 
                            style={{borderRadius:4, marginLeft:30, marginRight:30, paddingTop:0, paddingBottom:0}}>
                            <Button onPress={this.handleLogout} title={"UitLoggen"} color="transparent" style={styles.buttonText }>
                            </Button>
                            </LinearGradient>

                            </View>
                    

                            </View> 
                            
                            : 
                            <View>
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
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
                                ref={this.state.email}
                                label='Email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={email}
                                onChangeText={ (email) =>{ this.setState({ email }), this.handleChange() }}
                            />
                            </View>
                            <View
                            style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            }}>
                            <TextField
                                ref={this.state.password}
                                autoCapitalize='none'
                                autoCorrect={false}
                                enablesReturnKeyAutomatically={true}
                                clearTextOnFocus={true}
                                returnKeyType='done'
                                renderAccessory={this.renderPasswordAccessory}
                                secureTextEntry={true}
                                label='Wachtwoord'
                                value={password}
                                placeholder="*************"
                                onChangeText={ (password) =>{ this.setState({ password }), this.handleChange() }}
                            />
                            </View>
                            <Text style={{padding: 25}}>{error}</Text>
                            <View style={{flex: 1, flexDirection: 'row', padding:35, paddingTop:100}}>
                            <Text style={{fontFamily: 'montserrat.regular',paddingTop:10, fontSize:10, color:'black'}}>Wachtwoord vergeten?</Text>
                            <LinearGradient colors={['#000000', '#434343']} 
                            style={{borderRadius:4, marginLeft:30, paddingLeft:20, paddingRight:20, paddingTop:0, paddingBottom:0}}>
                            <Button onPress={this.handleSubmit} title={"Inloggen     >"} color="transparent" style={styles.buttonText }>
                            </Button>
                            </LinearGradient>
                            </View>
                            </View> }
                            </View> : 
                            
                            <View style={[spinners.container, spinners.horizontal]}>
                                <ActivityIndicator size="large" color="#000000" />
                            </View>
                        }

                
          
            </ScrollView>

        )
    }

}

const spinners = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop:200 
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  })
 
export default Home;
var styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingLeft: 25,
      paddingRight: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'montserrat.regular',
        textAlign: 'center',
        color: '#ffffff',
        
        backgroundColor: 'transparent',
      },
  });