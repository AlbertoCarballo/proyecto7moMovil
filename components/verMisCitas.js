import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

export default function HomeScreen({navigation}) {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const id_usuario = await AsyncStorage.getItem('id_usuario');

                if (id_usuario) {
                    const response = await fetch(`http://192.168.1.144:8000/api/ver-mis-citas-paciente/${id_usuario}`);
                    const data = await response.json();

                    if (response.ok && data.status === 200) {
                        setAppointments(data.data); 
                    } else {
                        Alert.alert('Error', data.message || 'No se pudieron cargar las citas');
                    }
                } else {
                    Alert.alert('Error', 'No se encontró el ID de usuario');
                }
            } catch (error) {
                console.error('Error al obtener las citas:', error);
                Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
            }
        };

        fetchAppointments();
    }, []);

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentItem}>
            <Text style={styles.date}>Fecha: {item.fecha_cita}</Text>
            <Text style={styles.time}>Hora: {item.hora_consulta}</Text>
            <Text style={styles.doctor}>Doctor: {item.nombre_doctor}</Text>
            <Text style={styles.consultorio}>Consultorio: {item.consultorio}</Text>
            <Text style={styles.description}>Descripción: {item.descripcion_problema}</Text>
            <Text style={styles.status}>Estado: {item.estado}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Citas Médicas</Text>
            <FlatList
                data={appointments}
                renderItem={renderAppointment}
                keyExtractor={(item) => item.id_consultas.toString()} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    appointmentItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    time: {
        fontSize: 14,
    },
    doctor: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    consultorio: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    status: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 5,
        color: '#666',
    },
    button: {
        backgroundColor: '#1BACB1',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
