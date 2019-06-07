import AsyncStorage from '@react-native-community/async-storage'

export const Logout = () => {
    AsyncStorage.clear()
    this.props.navigation.navigate('Home')
}