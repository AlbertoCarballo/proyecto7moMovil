import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({navigation}) => {
    const menuItems = [
        {
            id: '1',
            title: 'Ver Citas',
            image: require('../assets/mis-consultas.png'),
            onPress: () => navigation.navigate("verMisCitas")
        },
        {
            id: '2',
            title: 'Ver Doctores',
            image: require('../assets/doctores.png'),
            onPress: () => navigation.navigate("ListaDoctores")

        },
        {
            id: '3',
            title: 'Crear Cita',
            image: require('../assets/crear-cita.png'),
            onPress: () => navigation.navigate("CrearCita")
        }
    ];

    const renderMenuItem = ({ item }) => (
        <TouchableOpacity style={styles.banner} onPress={item.onPress}>
            <Image 
                source={item.image} 
                style={styles.bannerImage} 
            />
            <Text style={styles.bannerText}>{item.title}</Text>
        </TouchableOpacity>
    );

    const user = {
        name: AsyncStorage.getItem('nombre_usuario'),
        profilePicture: require('../assets/profile-picture.png'),
    };

    const onLogout = () => {
        AsyncStorage.setItem('id_usuario', "");
        AsyncStorage.setItem('nombre_usuario', "");
        navigation.navigate("login");
    }

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Image source={user.profilePicture} style={styles.profilePicture} />
                <Text style={styles.username}>{user.name}</Text>
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={() => onLogout()}
                >
                    <Image
                        source={require('../assets/logout.png')}
                        style={styles.logoutIcon}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 20,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        marginTop: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 50,
    },
    logoutIcon: {
        width: 20,
        height: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    banner: {
        width: '100%', // Aseguramos que el banner ocupe todo el ancho disponible
        maxWidth: 375, // Máximo ancho para mantenerlo dentro de límites razonables
        alignSelf: 'center', // Aseguramos que el banner se centre en el contenedor
        height: 200,
        alignItems: 'center',
        backgroundColor: '#1BACB1',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    bannerImage: {
        width: 353,
        height: 165,
        marginBottom: 5,
        marginTop: -20,
        borderRadius: 8,
    },
    bannerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default HomeScreen;