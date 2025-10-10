import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';

const apiKey = Constants.expoConfig.extra.EXPO_PUBLIC_GOOGLE_AI_KEY;

export default function GetLegalAdviceScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const askGoogleAI = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Prepend user's query
    setMessages(prev => [{ role: 'user', text: query }, ...prev]);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: query }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log('🔍 Google AI Response:', data);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not find a suitable answer.';

      setMessages(prev => [{ role: 'ai', text: aiText }, ...prev]);
    } catch (error) {
      console.error('❌ Error fetching from Google AI:', error);
      setMessages(prev => [
        { role: 'ai', text: '❌ There was an error fetching legal advice.' },
        ...prev,
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // When user scrolls away from the top, show the button
    setShowScrollTop(offsetY < -50 ? true : false);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f3f4f6' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Section */}
      <View style={styles.querySection}>
        <Text style={styles.header}>⚖️ Get Legal Advice</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your legal query..."
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            multiline
          />
          <TouchableOpacity style={styles.askButton} onPress={askGoogleAI} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.askText}>Ask</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Section */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {item.role === 'ai' ? (
              <Markdown>{item.text}</Markdown>
            ) : (
              <Text style={styles.userText}>{item.text}</Text>
            )}
          </View>
        )}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <Ionicons name="arrow-up" size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  querySection: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 15,
  },
  askButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  askText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  messageBubble: {
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
