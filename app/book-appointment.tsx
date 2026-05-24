import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';

interface Category {
  _id: string;
  name: string;
}

interface Advocate {
  _id: string;
  name: string;
  advId: string;
  specialization?: Category;
  courtDivision?: Category;
}

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function BookAppointmentScreen() {
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedAdvocate, setSelectedAdvocate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  const [modeOfAppointment, setModeOfAppointment] = useState<'Online' | 'Offline'>('Online');
  const [notes, setNotes] = useState('');

  // 1. Fetch all advocates
  const { data: advocates, isLoading: advocatesLoading } = useQuery({
    queryKey: ['advocates'],
    queryFn: async () => {
      const response = await apiClient.get('/user/advocates/search');
      return response.data.data as Advocate[];
    },
  });

  // 2. Fetch slots when an advocate is selected
  // We need to use advId (the string ID) for the endpoint /user/advocates/:advId/slots
  const selectedAdvData = advocates?.find(a => a._id === selectedAdvocate);
  
  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['advocate-slots', selectedAdvData?.advId],
    queryFn: async () => {
      const response = await apiClient.get(`/user/advocates/${selectedAdvData?.advId}/slots`);
      return response.data.data as Slot[];
    },
    enabled: !!selectedAdvData?.advId,
  });

  // Derived state for cascading dropdowns
  const courts = useMemo(() => {
    if (!advocates) return [];
    const map = new Map<string, string>();
    advocates.forEach(a => {
      if (a.courtDivision) map.set(a.courtDivision._id, a.courtDivision.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [advocates]);

  const specialties = useMemo(() => {
    if (!advocates || !selectedCourt) return [];
    const map = new Map<string, string>();
    advocates.filter(a => a.courtDivision?._id === selectedCourt).forEach(a => {
      if (a.specialization) map.set(a.specialization._id, a.specialization.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [advocates, selectedCourt]);

  const filteredAdvocates = useMemo(() => {
    if (!advocates) return [];
    return advocates.filter(a => 
      (!selectedCourt || a.courtDivision?._id === selectedCourt) &&
      (!selectedSpecialty || a.specialization?._id === selectedSpecialty)
    );
  }, [advocates, selectedCourt, selectedSpecialty]);

  // Mutation to book appointment
  const queryClient = useQueryClient();
  const bookMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.post('/user/appointments', payload);
      return response.data;
    },
    onSuccess: (data) => {
      Alert.alert('Success', `✅ Appointment booked successfully!`);
      setSelectedAdvocate('');
      setSelectedSlot('');
      setNotes('');
      // Invalidate appointments so the Upcoming list refreshes
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to book appointment');
    },
  });

  const handleBooking = () => {
    if (!selectedAdvocate) {
      Alert.alert('Validation Error', 'Please select an advocate.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Validation Error', 'Please select an available slot.');
      return;
    }

    bookMutation.mutate({
      slotId: selectedSlot,
      mode: modeOfAppointment.toLowerCase(),
      notes: notes,
    });
  };

  if (advocatesLoading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Book an Appointment</Text>

      {/* 1. Court Selection */}
      <Text style={styles.label}>Select Court Division</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCourt}
          onValueChange={(value) => {
            setSelectedCourt(value);
            setSelectedSpecialty('');
            setSelectedAdvocate('');
            setSelectedSlot('');
          }}
        >
          <Picker.Item label="-- All Courts --" value="" />
          {courts.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>

      {/* 2. Specialty Selection */}
      <Text style={styles.label}>Select Legal Matter</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSpecialty}
          onValueChange={(value) => {
            setSelectedSpecialty(value);
            setSelectedAdvocate('');
            setSelectedSlot('');
          }}
          enabled={!!selectedCourt || specialties.length > 0}
        >
          <Picker.Item label="-- All Matters --" value="" />
          {specialties.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>

      {/* 3. Advocate Selection */}
      <Text style={styles.label}>Select Advocate</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAdvocate}
          onValueChange={(value) => {
            setSelectedAdvocate(value);
            setSelectedSlot('');
          }}
        >
          <Picker.Item label="-- Choose Advocate --" value="" />
          {filteredAdvocates.map((adv) => (
            <Picker.Item key={adv._id} label={adv.name} value={adv._id} />
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

      {/* 4. Slot Selection */}
      {selectedAdvocate ? (
        <>
          <Text style={styles.label}>Select Available Slot</Text>
          <View style={styles.pickerContainer}>
            {slotsLoading ? (
              <ActivityIndicator style={{ padding: 15 }} />
            ) : slots && slots.length > 0 ? (
              <Picker
                selectedValue={selectedSlot}
                onValueChange={(value) => setSelectedSlot(value)}
              >
                <Picker.Item label="-- Choose a Slot --" value="" />
                {slots.map((slot) => {
                  const dateStr = new Date(slot.date).toLocaleDateString();
                  return (
                    <Picker.Item 
                      key={slot._id} 
                      label={`${dateStr} | ${slot.startTime} - ${slot.endTime}`} 
                      value={slot._id} 
                    />
                  );
                })}
              </Picker>
            ) : (
              <Text style={{ padding: 15, color: 'red' }}>No available slots found for this advocate.</Text>
            )}
          </View>
        </>
      ) : null}

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
      <TouchableOpacity onPress={handleBooking} style={styles.buttonWrapper} disabled={bookMutation.isPending}>
        <LinearGradient
          colors={['#4ade80', '#22c55e']}
          style={styles.button}
          start={[0, 0]}
          end={[1, 0]}
        >
          {bookMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Book Appointment</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
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
    minHeight: 50,
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
