import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { LogoDraw } from '../src';

const LOGO_PATH = 'M50 8 C56 28 76 26 90 50 C76 74 56 72 50 92 C44 72 24 74 10 50 C24 26 44 28 50 8 Z';

export default function App() {
  const [replay, setReplay] = useState(0);
  return <SafeAreaView style={styles.root}>
    <Text style={styles.title}>Logo Draw</Text>
    <LogoDraw path={LOGO_PATH} pathLength={260} size={180} replayTrigger={replay} />
    <Button title="Replay" onPress={() => setReplay(value => value + 1)} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({ root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 }, title: { fontSize: 24, fontWeight: '700' } });
