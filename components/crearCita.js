import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Modal, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function CrearCitaScreen({navigation}) {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoctorConsultorio, setSelectedDoctorConsultorio] = useState('');
    

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://192.168.1.144:8000/api/ver-doctores');
                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setDoctors(data.data);
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

    const handleCreateAppointment = async () => {
        try {
            const id_usuario = await AsyncStorage.getItem('id_usuario');
            const nombre_paciente = await AsyncStorage.getItem('nombre_usuario');
            if (!id_usuario) {
                Alert.alert('Error', 'No se encontró el ID de usuario');
                return;
            }

            const appointmentData = {
                id_paciente: id_usuario,
                nombre_paciente: nombre_paciente,
                id_doctor: selectedDoctor,
                nombre_doctor: selectedDoctorName,
                fecha_cita: selectedDate.toISOString().split('T')[0],
                hora_consulta: selectedTime.toISOString().split('T')[1].substring(0, 5),
                descripcion_problema: description,
                consultorio: selectedDoctorConsultorio,
            };
            console.log(appointmentData);
            const response = await fetch('http://192.168.1.144:8000/api/crear-cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            const data = await response.json();

            if (data.status === 200) {
                console.log('Cita creada exitosamente');
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', data.message || 'No se pudo crear la cita');
                navigation.navigate('Home');

            }
        } catch (error) {
            console.error('Error al crear la cita:', error);
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
        }
    };

    const renderDoctorItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedDoctor(item.id_doctor.toString());
                setSelectedDoctorName(`${item.nombre} ${item.primer_apellido}`);
                setSelectedDoctorConsultorio(item.consultorio);
                setModalVisible(false);
            }}
            style={styles.doctorItem}
        >
            <Text style={styles.doctorText}>{`${item.nombre} ${item.primer_apellido}`}</Text>
            <Text style={styles.consultorioText}>Consultorio: {item.consultorio}</Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <Text style={styles.title}>Crear Nueva Cita</Text>

            <Text style={styles.label}>Selecciona Doctor</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
                <Text>{selectedDoctorName ? selectedDoctorName : 'Selecciona un doctor'}</Text>
            </TouchableOpacity>

            {selectedDoctorConsultorio && (
                <View style={styles.consultorioContainer}>
                    <Text style={styles.label}>Consultorio</Text>
                    <View style={styles.input}>
                        <Text>{selectedDoctorConsultorio}</Text>
                    </View>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Seleccionar Doctor</Text>
                        <FlatList
                            data={doctors}
                            keyExtractor={(item) => item.id_doctor.toString()}
                            renderItem={renderDoctorItem}
                            style={styles.flatList}
                            showsVerticalScrollIndicator={true}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.label}>Fecha de Cita</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{selectedDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            <Text style={styles.label}>Hora de Cita</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                <Text>{selectedTime.toISOString().split('T')[1].substring(0, 5)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={(event, time) => {
                        setShowTimePicker(false);
                        if (time) setSelectedTime(time);
                    }}
                />
            )}

            <Text style={styles.label}>Descripción del Problema</Text>
            <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Describa el problema..."
                onChangeText={(text) => setDescription(text)}
                value={description}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateAppointment}
            >
                <Text style={styles.buttonText}>Crear Cita</Text>
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
        
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
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1BACB1',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    flatList: {
        width: '100%',
        marginVertical: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    doctorItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    doctorText: {
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#1BACB1',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    consultorioContainer: {
        marginBottom: 15,
    },
    consultorioText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});
