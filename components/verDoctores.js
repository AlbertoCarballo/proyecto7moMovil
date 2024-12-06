import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';

export default function DoctorListScreen() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://192.168.1.144:8000/api/ver-doctores');
                const result = await response.json();

                if (response.ok && result.status === 'success' && Array.isArray(result.data)) {
                    setDoctors(result.data); 
                } else {
                    Alert.alert('Error', 'No se pudieron cargar los doctores');
                }
            } catch (error) {
                console.error('Error al obtener los doctores:', error);
                Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
            }
        };

        fetchDoctors();
    }, []);

    const renderDoctor = ({ item }) => (
        <View style={styles.doctorItem}>
            <Text style={styles.name}>{`${item.nombre} ${item.primer_apellido} ${item.segundo_apellido || ''}`}</Text>
            <Text style={styles.consultorio}>Consultorio: {item.consultorio}</Text>
            <Text style={styles.cedula}>Cédula: {item.cedula_profesional}</Text>
            <Text style={styles.rfc}>RFC: {item.rfc}</Text>
            <Text style={styles.almaMater}>Alma Mater: {item.alama_mater}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Doctores</Text>
            <FlatList
                data={doctors}
                renderItem={renderDoctor}
                keyExtractor={(item) => item.id_doctor.toString()}
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
    doctorItem: {
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
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    consultorio: {
        fontSize: 14,
    },
    cedula: {
        fontSize: 14,
        color: '#666',
    },
    rfc: {
        fontSize: 14,
        color: '#666',
    },
    almaMater: {
        fontSize: 14,
        color: '#666',
    },
});
