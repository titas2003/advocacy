import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

import Constants from 'expo-constants';

const apiKey = Constants.expoConfig.extra.EXPO_PUBLIC_GOOGLE_AI_KEY;

export default function GetLegalAdviceScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const askGoogleAI = async () => {
    if (!query.trim()) return;
    setLoading(true);

    const updatedMessages = [...messages, { role: 'user', text: query }];
    setMessages(updatedMessages);

    try {
      // ✅ Use v1 endpoint + gemini-1.5-flash
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

      setMessages([...updatedMessages, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('❌ Error fetching from Google AI:', error);
      setMessages([
        ...updatedMessages,
        { role: 'ai', text: '❌ There was an error fetching legal advice.' },
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
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
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {msg.role === 'ai' ? (
              <Markdown>{msg.text}</Markdown>
            ) : (
              <Text style={styles.userText}>{msg.text}</Text>
            )}
          </View>
        ))}
      </ScrollView>
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
    padding: 16,
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
});