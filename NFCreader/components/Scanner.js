import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView,
  Image
} from 'react-native';
//http client
import axios from 'axios';
//nfc read write
import NfcManager, { ByteParser, NfcTech, nfcManager } from 'react-native-nfc-manager';
//localstorage
import AsyncStorage from '@react-native-community/async-storage'
//styles
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
//components
import config from '../config'

const KeyTypes = ['A', 'B'];

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetecting: true,
      mode: 'read',
      keyAorB: KeyTypes[0], // 'A'
      keyToUse: config.Key,
      sector: config.Sector,
      card: {card_code:''},
      user: {
        name: '',
        surname: '',
        dob: '',
        image: '',
        flags: '',
        age: ''
      },
      image:'../content/img/profile.png',
      error: '',
      standby: true,
      warning:''
    };
  }
  static navigationOptions = {
    drawerIcon : ({tintColor}) => (
        <Icon name="eye" style={{fontSize:24, color:tintColor}}/>
    )
  }
  
  //start nfc all
  componentDidMount() {
    NfcManager.isSupported(NfcTech.MifareClassic).then(supported => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
        this._startDetection();
      }
    });
  }

 componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  } 

  render() {
    let {
      isDetecting,
      card,
      user,
      image,
    } = this.state;
    let bijzonderheden =       
    <View style={{flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop:42}}>
    <Image style={{ width: 25, height: 25}} source={require('../content/img/red.png')} />
    <Text style={{marginLeft:10,paddingTop:4, fontSize:13, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>{user.flags.slice(Math.max(user.flags.length - 3, 1))}</Text>
    </View>

    let warning = "";
    if (this.state.user.flags == 0){
      warning = 
      <View style={{flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingTop:42}}>
      <Image style={{ width: 25, height: 25}} source={require('../content/img/green.png')} />
      <Text style={{marginLeft:10,paddingTop:4, fontSize:13, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>{user.name} heeft geen waarschuwingen</Text>
      </View>

      ,
      bijzonderheden = null
    }
    
    return (
      
      
      <ScrollView style={{flex: 1}}>
          {
            this.state.standby ? 
            <View style={{alignItems: 'stretch', justifyContent:'center'}}> 
                  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                      <View style={{ height: 180, flex:1}}> 
                      <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={require('../content/img/profile.png')} />
                      <View style={{ position:"absolute", top:80, left:150}}>
                          <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>Gebruiker</Text>
                      </View>
                      </View>
                  </LinearGradient>
                  
                  <View style={{paddingTop:100,  justifyContent: 'center',
    alignItems: 'center',}}>
                    <Text style={{paddingLeft:25, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>
                      Plaats een ACE kaart voor uw mobiel om gegevens op te halen van een persoon.
                    </Text>
                    <Image style={{borderRadius:20,width: 130, height: 130}} source={require('../content/img/scan.png')} />
                  </View>
                    
            </View> 
            : 
            <View> 
      <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                                <View style={{ height: 180, flex:1}}>
                                <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                                </View>         
                                <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={{uri: image}} />
                                <View style={{ position:"absolute", top:80, left:150}}>
                                    <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>Gebruiker</Text>
                                    <Text style={{color:'white', letterSpacing:3.02, fontWeight:'bold', fontSize:30,  fontFamily: 'montserrat.regular' }}>{user.name} {user.age}</Text>
                                </View>
                               
                                </View>
                            </LinearGradient>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'stretch',
                            }}>
                              {/* kop1 */}
                                <View style={{borderRadius:6, elevation:8, marginTop:50, marginRight:30 ,marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                                  <Text style={{paddingLeft:15, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>Algemene Informatie</Text>
                                  <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>naam: {user.name} {user.surname}</Text>
                                  <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>email: {user.surname}</Text>
                                  <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>geboortedatum: {user.dob}</Text>
                                </View>
                              {/* kop2 */}
                              <View>  
                              <Text>
                              {bijzonderheden}
                              </Text>
                              </View>
                              {/* kop3 */}
                              <View style={{borderRadius:6 ,elevation:8,marginBottom:20, marginTop:20, marginRight: 30, marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                                {warning}
                              </View>

                                {!isDetecting && (
            <TouchableOpacity
                                  
              onPress={() => this._startDetection()}
            >
            <Text style={{textAlign: 'center'}}>{this.state.error}</Text> 
          <Text style={{color:'#9A9A9A', fontWeight:'bold',fontFamily: 'montserrat.regular', textAlign: 'center'}}>
                {`NIEUWE SCAN`}
              </Text>
            </TouchableOpacity>
          )}
          {isDetecting && (
            
            <TouchableOpacity
              onPress={() => this._stopDetection()}
            >
              <Text style={{color:'#9A9A9A', fontWeight:'bold',fontFamily: 'montserrat.regular', textAlign: 'center'}}>
                {`STOP MET  ${this.state.mode === 'read' ? 'SCANNEN' : 'WRITE'}`}
              </Text>
            </TouchableOpacity>
            
          )}  
                            </View>
                            </View> 
            </View> 
            }      
      </ScrollView>
    );
  }

//start met detecteren als de knop is ingedrukt
  _startDetection = () => {
    
    //stopt met het detecteren en leegt procesdata
    const cleanUp = () => {
      this.setState({isDetecting: false});
      NfcManager.closeTechnology();
      NfcManager.unregisterTagEvent();
    };

    //Leest alle blokken van een sector wat een encrypte code terugstuurt en linkt met het online profiel
    const read = async() => {
      return NfcManager.mifareClassicGetBlockCountInSector(parseInt(this.state.sector))
        .then(blocksInSector => {
          this.setState({ blocksInSector });
        })
        .then(() =>
        //readsector
         NfcManager.mifareClassicReadSector(parseInt(this.state.sector)),
        )
        .then(tag => {
          let _code = ByteParser.byteToString(tag);
          let _sector = _code.slice(0, 44);
          let test = _sector + '0000'
          console.log('coding')
          console.log(test)
          this.setState( {card: {card_code: test},standby: false})
        }).then( async() => {
              const header = 'Bearer ' + await AsyncStorage.getItem('jwt token')
              const body = JSON.stringify(this.state.card)
              console.log('apicall')
              console.log(this.state.card.card_code)
              axios.post(config.API_URL + '/api/club/scan', body, {headers: {Authorization:header}})
              .then((res) => {
                //leeftijd in jaren
                var today = new Date();
                var birthDate = new Date(res.data.dob);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
                    age = age - 1;
                }
                this.setState({
                  error: '',
                  user: {
                    name: res.data.name,
                    surname: res.data.surname,
                    dob: res.data.dob,
                    image: res.data.image_path,
                    flags: res.data.flags,
                    age: age
                  }
                }, () => {
                  //get profielfoto base 64
                  axios.get(config.API_URL+'/' + this.state.user.image, {headers: {Authorization:header}, responseType:"blob"})
                  .then(response => {
                      const blob = response.data
                      const fileReaderInstance = new FileReader();
                      fileReaderInstance.readAsDataURL(blob); 
                      fileReaderInstance.onload = () => {
                          const base64data = fileReaderInstance.result;                
                          this.setState({image: base64data
                          })
                      }
                  })
                  .catch(err => console.log(err))
                  console.log(this.state.user.flags.length)
                  ,cleanUp();
                }) 
              })
              .catch(err => {
                if(err == 'Error: Request failed with status code 401'){
                  console.log('handling 401');
                  this.setState({error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83, textAlign:'center', fontFamily: 'montserrat.regular'}}>U heeft geen recht om te scannen!</Text> })
              }
              if(err == 'Error: Request failed with status code 404'){
                console.log('handling 404');
                this.setState({error: <Text style={{fontSize:10, color:'red', letterSpacing: 0.83 , textAlign:'center' ,fontFamily: 'montserrat.regular'}}>De Gebruiker is niet gevonden!</Text> })
              }
              console.log('testing')
                console.log(err)
                cleanUp()
              })
        }).catch(err => console.log(err));
    };
  
    //start de detectie
    this.setState({ isDetecting: true});
    NfcManager.registerTagEvent(tag => console.log(tag))
      .then(() => NfcManager.requestTechnology(NfcTech.MifareClassic))
      .then(() => NfcManager.getTag())
      .then(tag => {
        this.setState({ tag });
        return NfcManager.mifareClassicGetSectorCount();
      })
      .then(sectorCount => {
        this.setState({sectorCount});
      })
      .then(() => {
        let sector = parseInt(this.state.sector);
        if (isNaN(sector)) {
          this.setState({ sector: '0' });
          sector = 0;
        }
        
        // Convert given key to a UInt8Array
        const key = [];
        for (let i = 0; i < this.state.keyToUse.length - 1; i += 2) {
          key.push(parseInt(this.state.keyToUse.substring(i, i + 2), 16));
        }

        if (this.state.keyAorB === KeyTypes[0]) {
          return NfcManager.mifareClassicAuthenticateA(sector, key);
        } else {
          return NfcManager.mifareClassicAuthenticateB(sector, key);
        }
      })

      .then(() => {return read().catch(err => console.log(err));
      }) 
      .catch(err => {
        console.log(err);
      });
  };
  
  //stopdetecie
  _stopDetection = () => {
    NfcManager.cancelTechnologyRequest()
      .then(() => this.setState({ isDetecting: false }))
      .catch(err => console.log(err));
  };

  //startnfc bij componnentdidmount
  _startNfc = () => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(enabled => this.setState({ enabled }))
      .catch(err => {
        console.log(err);
        this.setState({ enabled: false });
      });
  };

  //verwijderdhuidigedata
  _clearMessages = () => {
    this.setState({
      card: null
    });
  };
}

export default Scanner;
var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  buttonText: {
      fontSize: 18,
      fontFamily: 'Montserat',
      textAlign: 'center',
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
});