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
} from 'react-native';
import NfcManager, { ByteParser, NfcTech, nfcManager } from 'react-native-nfc-manager';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';

const KeyTypes = ['A', 'B'];

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetecting: false,
      mode: 'read',
      keyAorB: KeyTypes[1], // 'B'
      keyToUse: '754264355f5d',
      sector: 10,
      sectorData: ''
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
      keyAorB,
      keyToUse,
      sector,
      sectorData,
    } = this.state;

    return (
      <ScrollView style={{flex: 1}}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#000000', '#434343']} style={styles.linearGradient}>
      <Icon style={{color:'white', paddingRight:20, margin:15, position:'absolute'}} name="menu" onPress={() => this.props.navigation.openDrawer()}/>

      <View style={{ height: 180, flex:1, flexDirection:'column'}}>
      
      <View style={{alignItems: 'stretch', justifyContent:'center'}}>
      </View> 
      {!isDetecting && (
            <TouchableOpacity
              style={{ marginTop: 30 }}
              onPress={() => this._startDetection()}
            >
              <Text
                style={{color:'white', fontWeight:'bold', fontSize:30, marginTop:70, fontFamily: 'montserrat.regular', textAlign: 'center' }}
              >
                {`START ${this.state.mode === 'read' ? 'READ' : 'WRITE'}`}
              </Text>
            </TouchableOpacity>
          )}
          {isDetecting && (
            <TouchableOpacity
              style={{ margin: 30 }}
              onPress={() => this._stopDetection()}
            >
              <Text style={{color:'#9A9A9A', fontWeight:'bold', fontSize:30, marginTop:70, fontFamily: 'montserrat.regular', textAlign: 'center'}}>
                {`STOP  ${this.state.mode === 'read' ? 'READ' : 'WRITE'}`}
              </Text>
            </TouchableOpacity>
            
          )}   
     
      </View>
      </LinearGradient>
      <View
      style={{
      padding: 20,
      paddingTop:0,
      }}>     
{
            <View
              style={{borderRadius:6 ,elevation:4, marginTop:20, marginRight:30 ,marginLeft: 30, backgroundColor: 'white'}}
            >
              <View style={{ flexDirection: 'row', margin: 10}}>
                <TouchableOpacity
                  style={[{ flex: 1, alignItems: 'center' }, this.state.mode === 'read' ? {backgroundColor: '#cc0000'} : {backgroundColor: '#d0d0d0'}]}
                  onPress={() => this.setState({
                    tag: null,
                    mode: 'read',
                    sectorCount: null,
                    sectorData: null,
                  })}
                >
                </TouchableOpacity>
           
              </View>

              <View style={{marginLeft:10 , marginRight:10}}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginRight: 33 }}>Key:</Text>
                  {KeyTypes.map(key => (
                    <TouchableOpacity
                      key={key}
                      style={{ marginRight: 10 }}
                      onPress={() => this.setState({ keyAorB: key })}
                    >
                      <Text style={{ color: keyAorB === key ? 'blue' : '#aaa' }}>
                        Use key {key}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 35 }}>Key (hex):</Text>
                  <TextInput
                    style={{ width: 200 }}
                    value={keyToUse}
                    onChangeText={keyToUse => this.setState({ keyToUse })}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 10 }}>Sector (0-15):</Text>
                  <TextInput
                    style={{ width: 200 }}
                    value={sector.toString(10)}
                    onChangeText={sector => this.setState({ sector: sector })}
                  />
                </View>
              </View>
            </View>
          }  
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              marginTop: 5,
            }}
          >
            <Text>{`Data Sector ${sector}`}</Text>      
              <Text
                style={{ marginTop: 5 }}
              >{sectorData}</Text>
              </View>

          <TouchableOpacity
            style={{ marginTop: 20, alignItems: 'center' }}
            onPress={this._clearMessages}
          >
            <Text style={{ color:'grey', color:'#9A9A9A', letterSpacing:1.02, fontWeight:'bold', fontSize:15,  fontFamily: 'montserrat.regular'}}>Clear</Text>
          </TouchableOpacity>
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
    
    const read = () => {
      return NfcManager.mifareClassicGetBlockCountInSector(parseInt(this.state.sector))
        .then(blocksInSector => {
          this.setState({ blocksInSector });
        })
        .then(() =>
         NfcManager.mifareClassicReadSector(parseInt(this.state.sector)),
        )
        .then(tag => {
          let _sector = ByteParser.byteToString(tag);
          let _code = _sector.slice(0, 44);
          this.setState({ sectorData: _code });
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
      .then(() => { return read() })
      .then(() => cleanUp)
      .catch(err => {
        console.warn(err);
        cleanUp();
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
      sectorData: null
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