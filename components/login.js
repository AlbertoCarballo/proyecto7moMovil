import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.144:8000/api/auth-movil', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    correo_electronico: "carlos.martinez90@gmail.com",  
                    contrasena: "password123"         
                }),
            });
    
            const data = await response.json();

            // Imprimir el objeto completo de la respuesta
            console.log('Datos completos de la respuesta:', data);
    
            if (response.ok && data.status === 200) {
                navigation.navigate('Home');
                console.log('ID del usuario:', data.id_usuario);

                await AsyncStorage.setItem('id_usuario', data.id_usuario.toString());
                await AsyncStorage.setItem('nombre_usuario', data.nombre_paciente.toString());
                
            } else {
                Alert.alert('Error', data.message || 'No se pudo iniciar sesión');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo_clinica.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Correo electrónico:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.title}>Contraseña:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese su contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: -100,
        marginBottom: 0,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#1BACB1',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        marginBottom: 10,
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

