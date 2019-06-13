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
import axios from 'axios';
import config from '../config'
import NfcManager, { ByteParser, NfcTech, nfcManager } from 'react-native-nfc-manager';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage'

const KeyTypes = ['A', 'B'];

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetecting: true,
      mode: 'read',
      keyAorB: KeyTypes[0], // 'A'
      keyToUse: 'FFFFFFFFFFFF',
      sector: 10,
      card: {card_code:''},
      user: {
        name: '',
        surname: '',
        dob: '',
        image: '',
        flags: ''
      },
      image:'../content/img/profile.png'
    };
  }
  static navigationOptions = {
    drawerIcon : ({tintColor}) => (
        <Icon name="eye" style={{fontSize:24, color:tintColor}}/>
    )
  }
  
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

    return (
      <ScrollView style={{flex: 1}}>
        
    
     
  

      <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
                            <Icon style={{color:'white', paddingRight:20, margin:15, position:'absolute'}} name="menu" onPress={() => this.props.navigation.openDrawer()}/>
       
                                <View style={{ height: 180, flex:1}}>
            
                                <View style={{alignItems: 'stretch', justifyContent:'center'}}>
                                </View>         
                                <Image style={{borderRadius:20,width: 130, height: 130, backgroundColor: 'white', position:"absolute", top:80, left:10 }} source={{uri: image}} />
                                <View style={{ position:"absolute", top:80, left:150}}>
                                    <Text style={{color:'grey', color:'#9A9A9A', letterSpacing:3.02, fontWeight:'bold', fontSize:23,  fontFamily: 'montserrat.regular' }}>Gebruiker</Text>
                                    <Text style={{color:'white', letterSpacing:3.02, fontWeight:'bold', fontSize:35,  fontFamily: 'montserrat.regular' }}>{user.name}</Text>
                                </View>
                               
                                </View>
                            </LinearGradient>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'stretch',
                            }}>
                                <View style={{borderRadius:6, elevation:8, marginTop:50, marginRight:30 ,marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                                <Text style={{paddingLeft:25, padding:10, fontSize:15, color:'#9A9A9A', letterSpacing: 0.83 ,fontFamily: 'montserrat.regular' }}>Algemene Informatie</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>naam: {user.name} {user.surname}</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>email: {user.surname}</Text>
                                <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>geboortedatum: {user.dob}</Text>
                                </View>
                                
                                <View style={{borderRadius:6 ,elevation:8,marginBottom:20, marginTop:20, marginRight: 30, marginLeft: 30, height: 110, backgroundColor: 'white'}} >
                                  <Text style={{padding:20, fontSize:12, color:'#9A9A9A', letterSpacing: 0.83, fontFamily: 'montserrat.regular' }}>Bijzonderheden</Text>
                                  <Text style={{paddingLeft:40, fontSize:12, color:'#9A9A9A', letterSpacing: 0.5 ,fontFamily: 'montserrat.regular'}}>{user.flags}</Text>

                                </View>
                                {!isDetecting && (
            <TouchableOpacity
            
              onPress={() => this._startDetection()}
            >
          <Text style={{color:'#9A9A9A', fontWeight:'bold',fontFamily: 'montserrat.regular', textAlign: 'center'}}>

                {`START MET ${this.state.mode === 'read' ? 'SCANNEN' : 'WRITE'}`}
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
      
      </ScrollView>
    );
  }

  _startDetection = () => {

    const cleanUp = () => {
      this.setState({isDetecting: false });
      NfcManager.closeTechnology();
      NfcManager.unregisterTagEvent();
    };
    
    const read = async() => {
      return NfcManager.mifareClassicGetBlockCountInSector(parseInt(this.state.sector))
        .then(blocksInSector => {
          this.setState({ blocksInSector });
        })
        .then(() =>
         NfcManager.mifareClassicReadSector(parseInt(this.state.sector)),
        )
        .then(tag => {
          let _code = ByteParser.byteToString(tag);
          let _sector = _code.slice(0, 44);
          let test = _sector + '0000'
          this.setState( {card: {card_code: test} })
        }).then( async() => {
                       const header = 'Bearer ' + await AsyncStorage.getItem('jwt token')
              console.log('card1')

              const body = JSON.stringify(this.state.card)
              console.log(body)
              axios.post(config.API_URL+'/api/club/scan', body, {headers: {Authorization:header}})
              .then((res) => {
                console.log(res)
                
                this.setState({
                  user: {
                    name: res.data.name,
                    surname: res.data.surname,
                    dob: res.data.dob,
                    image: res.data.image_path,
                    flags: res.data.flags
                  }
                }, () => {
                  axios.get(config.API_URL+'/' + this.state.user.image, {headers: {Authorization:header}, responseType:"blob"})
                  .then(response => {
                  
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
                }) 
                cleanUp()        
              })
              .catch(err => {
                console.log('error1')
                console.log(err)
              })
        });
    };
  
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
        
        // Convert 754264355f5d the key to a UInt8Array
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

      .then(() => {return read() }) 
      .catch(err => {
        console.warn(err);
      });
  };
  
  _stopDetection = () => {
    NfcManager.cancelTechnologyRequest()
      .then(() => this.setState({ isDetecting: false }))
      .catch(err => console.warn(err));
  };

  _startNfc = () => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(enabled => this.setState({ enabled }))
      .catch(err => {
        console.warn(err);
        this.setState({ enabled: false });
      });
  };

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