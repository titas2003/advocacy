import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BookAppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modeOfAppointment, setModeOfAppointment] = useState<'Online' | 'Offline'>('Online');
  const [selectedAdvocate, setSelectedAdvocate] = useState<string>('');
  const [notes, setNotes] = useState('');

  const advocates = ['Amit Sharma', 'Sneha Patel', 'Rahul Verma', 'Priya Nair'];

  // ✅ Android DateTimePicker handler
  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'datetime',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          setSelectedDate(date);
        }
      },
    });
  };

  const handleBooking = () => {
    if (!selectedAdvocate) {
      alert('Please select an advocate.');
      return;
    }
    alert(
      `✅ Appointment booked with ${selectedAdvocate} on ${selectedDate.toLocaleString()} (${modeOfAppointment})`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Book an Appointment</Text>

      {/* Advocate Selection */}
      <Text style={styles.label}>Select Advocate</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAdvocate}
          onValueChange={(value) => setSelectedAdvocate(value)}
        >
          <Picker.Item label="-- Choose Advocate --" value="" />
          {advocates.map((adv) => (
            <Picker.Item key={adv} label={adv} value={adv} />
          ))}
        </Picker>
      </View>

      {/* Mode of Appointment */}
      <Text style={styles.label}>Mode of Appointment</Text>
      <View style={styles.modeContainer}>
        {['Online', 'Offline'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              modeOfAppointment === mode && styles.modeButtonSelected,
            ]}
            onPress={() => setModeOfAppointment(mode as 'Online' | 'Offline')}
          >
            <Text
              style={[
                styles.modeButtonText,
                modeOfAppointment === mode && styles.modeButtonTextSelected,
              ]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date & Time Picker */}
      <Text style={styles.label}>Select Date & Time</Text>
      {Platform.OS === 'android' ? (
        <TouchableOpacity style={styles.input} onPress={openAndroidPicker}>
          <Text>{selectedDate.toLocaleString()}</Text>
        </TouchableOpacity>
      ) : (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="spinner"
          onChange={(event, date) => date && setSelectedDate(date)}
        />
      )}

      {/* Notes Section */}
      <Text style={styles.label}>Additional Notes (Optional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        multiline
        placeholder="Enter any details..."
        value={notes}
        onChangeText={setNotes}
      />

      {/* Book Now Button */}
      <TouchableOpacity onPress={handleBooking} style={styles.buttonWrapper}>
        <LinearGradient
          colors={['#4ade80', '#22c55e']}
          style={styles.button}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text style={styles.buttonText}>Check Availability</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonSelected: { backgroundColor: '#22c55e' },
  modeButtonText: { fontSize: 14, fontWeight: '600', color: '#333' },
  modeButtonTextSelected: { color: '#fff' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  buttonWrapper: { marginTop: 20 },
  button: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
