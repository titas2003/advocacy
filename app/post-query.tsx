import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Query {
  id: string;
  text: string;
  comments: number;
  upvotes: number;
  downvotes: number;
  ipcSection: string;
}

export default function PostQueryScreen() {
  const router = useRouter();
  const [queryText, setQueryText] = useState('');
  const [queries, setQueries] = useState<Query[]>([
    {
      id: '1',
      text: 'What is the procedure for filing a consumer complaint?',
      comments: 2,
      upvotes: 5,
      downvotes: 0,
      ipcSection: 'IPC 420',
    },
    {
      id: '2',
      text: 'How can I appeal against a traffic fine?',
      comments: 1,
      upvotes: 3,
      downvotes: 1,
      ipcSection: 'Section 181',
    },
  ]);

  const animatedValues = useRef<Animated.Value[]>(queries.map(() => new Animated.Value(50))).current;

  const handlePostQuery = () => {
    if (!queryText.trim()) return;
    const newQuery: Query = {
      id: (queries.length + 1).toString(),
      text: queryText,
      comments: 0,
      upvotes: 0,
      downvotes: 0,
      ipcSection: 'N/A',
    };
    animatedValues.unshift(new Animated.Value(50));
    setQueries([newQuery, ...queries]);
    setQueryText('');
  };

  useEffect(() => {
    animatedValues.forEach((val, index) => {
      Animated.timing(val, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }, [queries]);

  const handleUpvote = (id: string) =>
    setQueries(prev => prev.map(q => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q)));

  const handleDownvote = (id: string) =>
    setQueries(prev => prev.map(q => (q.id === id ? { ...q, downvotes: q.downvotes + 1 } : q)));

  const renderQuery = ({ item, index }: { item: Query; index: number }) => (
    <Animated.View style={{ transform: [{ translateY: animatedValues[index] }] }}>
      <View style={styles.card}>
        <Text style={styles.queryText}>{item.text}</Text>

        <View style={styles.ipcContainer}>
          <Text style={styles.ipcText}>{item.ipcSection}</Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.voteRow}>
            <TouchableOpacity style={styles.voteButton} onPress={() => handleUpvote(item.id)}>
              <MaterialIcons name="thumb-up" size={18} color="#0077ff" />
              <Text style={styles.voteText}>{item.upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.voteButton} onPress={() => handleDownvote(item.id)}>
              <MaterialIcons name="thumb-down" size={18} color="#ff4d4d" />
              <Text style={styles.voteText}>{item.downvotes}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.comments}>{item.comments} Comments</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="reply" size={16} color="#0077ff" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="attach-file" size={16} color="#0077ff" />
            <Text style={styles.actionText}>Attachment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Sticky Query Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Write your query here..."
          value={queryText}
          onChangeText={setQueryText}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePostQuery}>
          <LinearGradient
            colors={['#4ade80', '#22c55e']}
            style={styles.gradientButton}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.postButtonText}>Post Your Query</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Posted Queries */}
      <FlatList
        data={queries}
        keyExtractor={item => item.id}
        renderItem={renderQuery}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  inputSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    minHeight: 80,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  postButton: { alignItems: 'center' },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  postButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  queryText: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  ipcContainer: { alignSelf: 'flex-start', marginBottom: 12 },
  ipcText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  voteRow: { flexDirection: 'row', gap: 10 },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
  },
  voteText: { marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  comments: { fontSize: 12, color: '#555' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
  },
  actionText: { fontSize: 13, fontWeight: '600', color: '#0077ff' },
});
