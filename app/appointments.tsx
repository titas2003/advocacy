import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient from '../utils/apiClient';

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: async () => {
      const res = await apiClient.get('/user/appointments/upcoming');
      return res.data.data;
    },
  });

  const { data: past, isLoading: loadingPast } = useQuery({
    queryKey: ['appointments', 'past'],
    queryFn: async () => {
      const res = await apiClient.get('/user/appointments/past');
      return res.data.data;
    },
  });

  const appointments = tab === 'upcoming' ? upcoming : past;
  const isLoading = tab === 'upcoming' ? loadingUpcoming : loadingPast;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.advName}>Advocate: {item.advocateId?.name || 'Unknown'}</Text>
      <Text style={styles.date}>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.mode}>Mode: {item.mode}</Text>
      <Text style={[styles.status, { color: item.status === 'Confirmed' ? '#22c55e' : item.status === 'Cancelled' ? '#ef4444' : '#f59e0b' }]}>
        Status: {item.status}
      </Text>
      {item.paymentStatus && <Text style={styles.payment}>Payment: {item.paymentStatus}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' && styles.activeTab]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'past' && styles.activeTab]}
          onPress={() => setTab('past')}
        >
          <Text style={[styles.tabText, tab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0077ff" style={{ marginTop: 20 }} />
      ) : appointments?.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>No {tab} appointments found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#0077ff',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  advName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  mode: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  payment: {
    fontSize: 13,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
    fontSize: 16,
  },
});
