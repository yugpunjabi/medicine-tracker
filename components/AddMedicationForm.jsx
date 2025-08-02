import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import { TypeList, WhenToTake } from './../constants/Options';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FormatDateForText, formatTime, getDatesRange } from '../service/ConvertDateTime';
import { ActivityIndicator, ScrollView } from 'react-native-web';
import { db } from '../configs/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getLocalStorage } from '../service/Storage';
import { useRouter } from 'expo-router';

let DatePicker;
if (Platform.OS === 'web') {
    DatePicker = require('react-datepicker').default;
    require('react-datepicker/dist/react-datepicker.css');
}

export default function AddMedicationForm() {
    const [formData, setFormData] = useState({});
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        console.log({ ...formData, [field]: value });
    };

    const SaveMedication = async () => {
        const docId = Date.now().toString();
        const user = await getLocalStorage('userDetail');
        if (
            !formData?.name ||
            !formData?.type ||
            !formData?.dose ||
            !formData?.startDate ||
            !formData?.endDate ||
            !formData?.reminder
        ) {
            if (Platform.OS === 'web') {
                alert('Enter all fields');
            } else {
                Alert.alert('Enter all fields');
            } return;

        }
        const dates=getDatesRange(formData?.startDate,formData.endDate);
        console.log(dates);
        setLoading(true);
        try {
            await setDoc(doc(db, 'medication', docId), {
                ...formData,
                userEmail: user?.email,
                docId: docId,
                dates:dates
            });

            console.log('Data Saved!');
            setLoading(false);

            if (Platform.OS === 'android') {
                Alert.alert("Great!", "New Medication added successfully!", [
                    {
                        text: 'Ok',
                        onPress: () => router.push('(tabs)')
                    }
                ]);
            }

            if (Platform.OS === 'web') {
                alert("New Medication added successfully!");
                router.push('(tabs)');
            }

        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error saving data. Please try again.");
        }

    }


    return (
        <View style={{ padding: 25 }}>
            <Text style={styles.header}>Add New Medication</Text>

            {/* Medicine Name */}
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="medkit-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Medicine Name"
                    onChangeText={(value) => onHandleInputChange('name', value)}
                />
            </View>

            {/* Type List */}
            <FlatList
                data={TypeList}
                horizontal
                style={{ marginTop: 5 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.inputGroup,
                            { marginRight: 10 },
                            { backgroundColor: item.name === formData?.type?.name ? Colors.PRIMARY : 'white' }
                        ]}
                        onPress={() => onHandleInputChange('type', item)}
                    >
                        <Text style={[
                            styles.typeText,
                            { color: item.name === formData?.type?.name ? 'white' : 'black' }
                        ]}>
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Dose Input */}
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Dose Ex. 2, 5ml"
                    onChangeText={(value) => onHandleInputChange('dose', value)}
                />
            </View>

            {/* When to take */}
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
                <Picker
                    selectedValue={formData?.when}
                    onValueChange={(itemValue) => onHandleInputChange('when', itemValue)}
                    style={{ width: '90%', borderColor: 'transparent', borderWidth: 0, outlineStyle: 'none' }}
                >
                    {WhenToTake.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>

            {/* Start & End Dates */}
            <View style={styles.dateInputGroup}>
                {/* Start Date */}
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => Platform.OS !== 'web' && setShowStartDate(true)}
                    activeOpacity={Platform.OS === 'web' ? 1 : 0.7}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    {Platform.OS === 'web' && DatePicker ? (
                        <DatePicker
                            selected={formData?.startDate ? new Date(formData.startDate) : null}
                            onChange={(date) => onHandleInputChange('startDate', date?.toISOString().split('T')[0])}
                            placeholderText="Start Date"
                            customInput={
                                <TextInput
                                    style={styles.text}
                                    value={formData?.startDate ?? ''}
                                    placeholder="Start Date"
                                />
                            }
                        />
                    ) : (
                        <Text style={styles.text}>
                            {formData?.startDate ? FormatDateForText(formData.startDate) : 'Start Date'}
                        </Text>
                    )}
                </TouchableOpacity>

                {showStartDate && Platform.OS !== 'web' && (
                    <DateTimePicker
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowStartDate(false);
                            if (selectedDate) {
                                onHandleInputChange('startDate', selectedDate.toISOString().split('T')[0]);
                            }
                        }}
                        value={formData?.startDate ? new Date(formData.startDate) : new Date()}
                        mode="date"
                        display="default"
                    />
                )}

                {/* End Date */}
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => Platform.OS !== 'web' && setShowEndDate(true)}
                    activeOpacity={Platform.OS === 'web' ? 1 : 0.7}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    {Platform.OS === 'web' && DatePicker ? (
                        <DatePicker
                            selected={formData?.endDate ? new Date(formData.endDate) : null}
                            onChange={(date) => onHandleInputChange('endDate', date?.toISOString().split('T')[0])}
                            placeholderText="End Date"
                            customInput={
                                <TextInput
                                    style={styles.text}
                                    value={formData?.endDate ?? ''}
                                    placeholder="End Date"
                                />
                            }
                        />
                    ) : (
                        <Text style={styles.text}>
                            {formData?.endDate ? FormatDateForText(formData.endDate) : 'End Date'}
                        </Text>
                    )}
                </TouchableOpacity>

                {showEndDate && Platform.OS !== 'web' && (
                    <DateTimePicker
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowEndDate(false);
                            if (selectedDate) {
                                onHandleInputChange('endDate', selectedDate.toISOString().split('T')[0]);
                            }
                        }}
                        value={formData?.endDate ? new Date(formData.endDate) : new Date()}
                        mode="date"
                        display="default"
                    />
                )}
            </View>

            {/* Reminder Time */}
            <View style={styles.dateInputGroup}>
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Ionicons style={styles.icon} name="timer-outline" size={24} color="black" />
                    <Text style={styles.text}>{formData?.reminder ?? 'Select Reminder Time'}</Text>
                </TouchableOpacity>
            </View>

            {/* Time Picker for Android/Web */}
            {showTimePicker && (
                Platform.OS === 'web' && DatePicker ? (
                    <DatePicker
                        selected={formData?.reminderDate ? new Date(formData.reminderDate) : null}
                        onChange={(date) => {
                            if (date) {
                                onHandleInputChange('reminder', formatTime(date));
                                onHandleInputChange('reminderDate', date);
                            }
                            setShowTimePicker(false);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        inline
                    />
                ) : (
                    <DateTimePicker
                        mode="time"
                        display="clock"
                        onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) {
                                onHandleInputChange('reminder', formatTime(selectedDate));
                            }
                        }}
                        value={new Date()}
                    />
                )
            )}

            <TouchableOpacity style={styles.button} onPress={SaveMedication}>
                {loading ? <ActivityIndicator size={'large'} color={'white'} /> :
                    <Text style={styles.buttontext}>
                        Add New Medication
                    </Text>}
            </TouchableOpacity>
        </View>


    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        marginTop: 10,
        backgroundColor: 'white'
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        outlineStyle: 'none'
    },
    icon: {
        color: Colors.PRIMARY,
        borderRightWidth: 1,
        paddingRight: 12,
        borderColor: Colors.GRAY
    },
    typeText: {
        fontSize: 16
    },
    text: {
        fontSize: 16,
        padding: 10,
        flex: 1,
        marginLeft: 10
    },
    dateInputGroup: {
        flexDirection: 'row',
        gap: 10
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        width: '100%',
        marginTop: 20
    },
    buttontext: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',

    }
});
