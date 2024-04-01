import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Amplify, Auth } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration';

Amplify.configure(amplifyconfig);

const AuthService = {
  signUp: async (email, password) => {
    try {
      const user = await Auth.signUp({
        username: email,
        password: password,
        attributes: {},
        autoSignIn: { enable: false },
      });
      console.log(user);
      return user;
    } catch (error) {
      console.log('error signing up:', error);
      throw error;
    }
  },

  confirmSignUp: async (email, code) => {
    try {
      const user = await Auth.confirmSignUp(email, code);
      console.log(user);
      return user;
    } catch (error) {
      console.log('error confirming sign up:', error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      return user;
    } catch (error) {
      console.log('error signing in:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await Auth.signOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.log('error signing out:', error);
      throw error;
    }
  },

  checkCurrentUser: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('Current user:', user);
      return user;
    } catch (error) {
      console.log('No current user:', error);
      throw error;
    }
  },
};

const AuthScreen = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initAuth = async () => {
      try {
        await AuthService.checkCurrentUser();
        setIsUserSignedIn(true);
      } catch {
        setIsUserSignedIn(false);
      }
    };
    initAuth();
  }, []);

  const handleSignUp = async () => {
    try {
      await AuthService.signUp(mail, password);
      alert('Inscription réussie, veuillez vérifier votre OTP');
    } catch (error) {
      alert('Erreur lors de l\'inscription: ' + error.message);
    }
  };

  const handleOTPVerification = async () => {
    try {
      await AuthService.confirmSignUp(mail, otp);
      alert('OTP vérifié avec succès');
    } catch (error) {
      alert('Erreur lors de la vérification de l\'OTP: ' + error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await AuthService.signIn(mail, password);
      setIsUserSignedIn(true);
      alert('Connexion réussie');
    } catch (error) {
      alert('Erreur lors de la connexion: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setIsUserSignedIn(false);
      alert('Déconnexion réussie');
    } catch (error) {
      alert('Erreur lors de la déconnexion: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!isUserSignedIn ? (
        <>
          {showSignIn && (
            <>
              <TextInput placeholder="Email" value={mail} onChangeText={setMail} style={styles.input} />
              <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
              <Button title="Se connecter" onPress={handleSignIn} />
              <TouchableOpacity onPress={() => { setShowSignUp(true); setShowSignIn(false); }}>
                <Text style={styles.switchText}>Pas de compte ? Inscrivez-vous</Text>
              </TouchableOpacity>
            </>
          )}
          {showSignUp && (
            <>
              <TextInput placeholder="Email" value={mail} onChangeText={setMail} style={styles.input} />
              <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword}  style={styles.input} />
              <Button title="S'inscrire" onPress={handleSignUp} />
              <TextInput placeholder="OTP" value={otp} onChangeText={setOTP} keyboardType="numeric" style={styles.input} />
              <Button title="Vérifier OTP" onPress={handleOTPVerification} />
              <TouchableOpacity onPress={() => { setShowSignUp(false); setShowSignIn(true); }}>
                <Text style={styles.switchText}>Avez-vous déjà un compte ? Connectez-vous</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.welcomeText}>Bienvenue ! Vous êtes connecté.</Text>
          <Button title="Se déconnecter" onPress={handleSignOut} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  switchText: {
    marginTop: 20,
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default AuthScreen;