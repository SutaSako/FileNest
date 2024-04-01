
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Authentification from './Authentification';

function HomeScreen(){

  return (
    <View style={styles.container}>
      <Authentification />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default HomeScreen;