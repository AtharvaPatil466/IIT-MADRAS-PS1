import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { queryChat } from '../src/lib/api';

const COLORS = {
  background: '#0b1326',
  surface: 'rgba(23, 31, 51, 0.7)',
  primary: '#2563eb',
  text: '#dae2fd',
  textVariant: '#c3c6d7',
  border: 'rgba(255, 255, 255, 0.1)',
  userBubble: '#2563eb',
  botBubble: 'rgba(45, 52, 73, 0.6)',
};

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  citation?: string;
  confidence?: 'high' | 'medium' | 'low';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'bot',
    content: 'Hello! I am your DriveLegal AI assistant. How can I help you with traffic laws today?',
    timestamp: '10:00 AM',
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const result = await queryChat(question);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: result.answer,
        citation: result.citations && result.citations.length > 0 ? result.citations[0].section : undefined,
        confidence: result.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setError('Failed to get a response. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Legal Assistant</Text>
        <Text style={styles.headerSubtitle}>Powered by DriveLegal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.chatContainer}>
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageWrapper,
              msg.role === 'user' ? styles.userWrapper : styles.botWrapper
            ]}
          >
            <View 
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.userBubble : styles.botBubble
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
              
              {msg.role === 'bot' && msg.confidence === 'low' && (
                <Text style={styles.caveat}>
                  Low confidence — verify with official sources.
                </Text>
              )}

              {msg.citation && (
                <View style={styles.citationBadge}>
                  <Ionicons name="document-text-outline" size={12} color={COLORS.primary} />
                  <Text style={styles.citationText}>{msg.citation}</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator style={styles.spinner} color={COLORS.primary} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.glassInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about traffic laws..."
            placeholderTextColor={COLORS.textVariant}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            editable={!loading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textVariant,
    marginTop: 4,
  },
  chatContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  messageWrapper: {
    marginBottom: 20,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.botBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  citationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  citationText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textVariant,
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  glassInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caveat: {
    color: '#f59e0b',
    fontSize: 12,
    marginTop: 4,
  },
  spinner: {
    marginTop: 12,
    alignSelf: 'center',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
  },
});
