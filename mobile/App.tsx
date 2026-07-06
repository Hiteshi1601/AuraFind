import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, Image, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  Compass, MapPin, MessageSquare, QrCode, Award, 
  Plus, Send, Camera, Sparkles, ShieldCheck 
} from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'report' | 'chat' | 'qr'>('feed');

  // Local data mock
  const [items, setItems] = useState([
    { id: '1', type: 'lost', title: 'Fossil Black Wallet', desc: 'Black leather Fossil wallet containing driver\'s license.', loc: 'Airport Terminal 3', date: '4h ago', reward: '₹500' },
    { id: '2', type: 'found', title: 'Leather Wallet (Black)', desc: 'Found a black leather wallet containing credit cards near T3 Gate 4.', loc: 'T3 Info Desk', date: '2h ago', reward: '' },
    { id: '3', type: 'lost', title: 'Blue Campus Backpack', desc: 'Blue school backpack containing a ThinkPad laptop.', loc: 'DU Library Floor 2', date: '1d ago', reward: '₹1000' }
  ]);

  // Form states
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'finder', text: "Hello! I reported finding a matching wallet near T3." }
  ]);
  const [chatInput, setChatInput] = useState('');

  // QR state
  const [qrName, setQrName] = useState('');
  const [qrResult, setQrResult] = useState<string | null>(null);

  // Submit report
  const handleReportSubmit = () => {
    if (!reportTitle || !reportDesc) return;
    const newReport = {
      id: (items.length + 1).toString(),
      type: reportType,
      title: reportTitle,
      desc: reportDesc,
      loc: 'Device GPS Location',
      date: 'Just now',
      reward: reportType === 'lost' ? '₹500' : ''
    };
    setItems([newReport, ...items]);
    setActiveTab('feed');
    setReportTitle('');
    setReportDesc('');
  };

  // Send message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now().toString(), sender: 'owner', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'finder', text: "Perfect. We can meet at the terminal security gate." }]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View class="flex-row items-center">
          <Text style={styles.headerEmoji}>🛡️</Text>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerTitle}>AuraFind Mobile</Text>
            <Text style={styles.headerSubtitle}>AI COGNITIVE RECOVERY NETWORK</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GPS Active</Text>
        </View>
      </View>

      {/* MAIN SCREEN CONTENT */}
      <View style={styles.content}>
        
        {/* RADAR FEED TAB */}
        {activeTab === 'feed' && (
          <View style={{ flex: 1 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Radar Feed</Text>
              <Text style={styles.sectionDesc}>Matching lost items with found reports automatically</Text>
            </View>

            {/* Match Banner mock */}
            <View style={styles.matchBanner}>
              <Text style={styles.matchEmoji}>🧠</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.matchTitle}>AI Match Detected (94.5%)</Text>
                <Text style={styles.matchDesc}>Leather Wallet matches Fossil Black Wallet</Text>
              </View>
              <TouchableOpacity style={styles.matchBtn} onPress={() => setActiveTab('chat')}>
                <Text style={styles.matchBtnText}>Verify</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {items.map(item => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, item.type === 'lost' ? styles.badgeLost : styles.badgeFound]}>
                      <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>

                  {item.reward ? (
                    <View style={styles.rewardContainer}>
                      <Award size={12} color="#fbbf24" />
                      <Text style={styles.rewardText}>Reward: {item.reward}</Text>
                    </View>
                  ) : null}

                  <View style={styles.cardFooter}>
                    <View style={styles.cardLocContainer}>
                      <MapPin size={12} color="#6366f1" />
                      <Text style={styles.cardLocText} numberOfLines={1}>{item.loc}</Text>
                    </View>
                    <TouchableOpacity style={styles.cardContact} onPress={() => setActiveTab('chat')}>
                      <MessageSquare size={12} color="#818cf8" />
                      <Text style={styles.cardContactText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Radar Map</Text>
              <Text style={styles.sectionDesc}>Visualizing nearby reports and safety geofences</Text>
            </View>
            
            {/* Map Simulation */}
            <View style={styles.mapSimulation}>
              <Compass size={48} color="#6366f1" style={{ marginBottom: 12 }} />
              <Text style={styles.mapSimText}>Interactive GPS Map Simulated</Text>
              <Text style={styles.mapSimSub}>Showing 3 items in Terminal 3 Metro Area</Text>
              
              <View style={styles.mapPinsContainer}>
                <View style={styles.mapPinRow}>
                  <View style={[styles.miniPin, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.miniPinText}>Fossil Wallet (Lost)</Text>
                </View>
                <View style={styles.mapPinRow}>
                  <View style={[styles.miniPin, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.miniPinText}>Leather Wallet (Found)</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* REPORT TAB */}
        {activeTab === 'report' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Report Item</Text>
              <Text style={styles.sectionDesc}>Submit text, photos, and GPS metadata</Text>
            </View>

            <View style={styles.formToggle}>
              <TouchableOpacity 
                style={[styles.toggleBtn, reportType === 'lost' && styles.toggleActiveLost]} 
                onPress={() => setReportType('lost')}
              >
                <Text style={[styles.toggleText, reportType === 'lost' && styles.textWhite]}>LOST</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, reportType === 'found' && styles.toggleActiveFound]} 
                onPress={() => setReportType('found')}
              >
                <Text style={[styles.toggleText, reportType === 'found' && styles.textWhite]}>FOUND</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>ITEM TITLE</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Fossil Black Wallet" 
                placeholderTextColor="#64748b"
                value={reportTitle}
                onChangeText={setReportTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>DESCRIPTION / DISTINCT FEATURES</Text>
              <TextInput 
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                placeholder="e.g. Fossil logo inside, black leather..." 
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
                value={reportDesc}
                onChangeText={setReportDesc}
              />
            </View>

            <TouchableOpacity style={styles.imageSelector}>
              <Camera size={24} color="#6366f1" />
              <Text style={styles.imageSelectorText}>Attach Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleReportSubmit}>
              <Text style={styles.submitBtnText}>Submit Report</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={styles.chatHeader}>
              <ShieldCheck size={16} color="#10b981" />
              <Text style={styles.chatTitle}>Secure Chat Session</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingVertical: 10 }}>
              {chatMessages.map(msg => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.chatBubble, 
                    msg.sender === 'owner' ? styles.bubbleOwner : styles.bubbleFinder
                  ]}
                >
                  <Text style={[styles.chatText, msg.sender === 'owner' && { color: 'white' }]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput 
                style={styles.chatInput} 
                placeholder="Type secure message..." 
                placeholderTextColor="#64748b"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
                <Send size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* QR CODE TAG TAB */}
        {activeTab === 'qr' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QR Tags</Text>
              <Text style={styles.sectionDesc}>Generate secure code to stick on your items</Text>
            </View>

            <View style={[styles.card, { width: '100%', alignItems: 'center', paddingVertical: 20 }]}>
              <TextInput 
                style={[styles.input, { width: '80%', marginBottom: 15 }]} 
                placeholder="e.g. My keys" 
                placeholderTextColor="#64748b"
                value={qrName}
                onChangeText={setQrName}
              />
              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={() => setQrResult(`AURAFIND-${qrName.toUpperCase()}-${Math.floor(Math.random()*90000)}`)}
              >
                <Text style={styles.submitBtnText}>Generate Code</Text>
              </TouchableOpacity>

              {qrResult ? (
                <View style={{ marginTop: 25, items: 'center', alignSelf: 'center' }}>
                  {/* Simulated QR Code */}
                  <View style={styles.qrSimulation}>
                    <View style={{ width: 100, height: 100, backgroundColor: 'white', flexWrap: 'wrap', flexDirection: 'row', p: 4 }}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <View key={i} style={{ width: 50, height: 50, backgroundColor: i % 2 === 0 ? 'black' : 'white' }} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.qrText}>{qrResult}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

      </View>

      {/* BOTTOM TAB NAVIGATION BAR */}
      <View style={styles.tabbar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('feed')}>
          <Compass size={20} color={activeTab === 'feed' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.tabLabel, activeTab === 'feed' && styles.tabLabelActive]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('map')}>
          <MapPin size={20} color={activeTab === 'map' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('report')}>
          <Plus size={20} color={activeTab === 'report' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.tabLabel, activeTab === 'report' && styles.tabLabelActive]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chat')}>
          <MessageSquare size={20} color={activeTab === 'chat' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.tabLabel, activeTab === 'chat' && styles.tabLabelActive]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('qr')}>
          <QrCode size={20} color={activeTab === 'qr' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.tabLabel, activeTab === 'qr' && styles.tabLabelActive]}>QR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  matchBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  matchEmoji: {
    fontSize: 20,
  },
  matchTitle: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: 'bold',
  },
  matchDesc: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 1,
  },
  matchBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  matchBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeLost: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeFound: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  typeBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDate: {
    color: '#64748b',
    fontSize: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  rewardText: {
    color: '#fbbf24',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 10,
    paddingTop: 8,
  },
  cardLocContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardLocText: {
    color: '#94a3b8',
    fontSize: 10,
    marginLeft: 4,
  },
  cardContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContactText: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabbar: {
    height: 55,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#020617',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
    fontWeight: 'bold',
  },
  tabLabelActive: {
    color: '#6366f1',
  },
  mapSimulation: {
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
  },
  mapSimText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapSimSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  mapPinsContainer: {
    marginTop: 20,
    width: '100%',
    gap: 8,
  },
  mapPinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 10,
  },
  miniPin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  miniPinText: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  formToggle: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 3,
    marginBottom: 15,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleActiveLost: {
    backgroundColor: '#ef4444',
  },
  toggleActiveFound: {
    backgroundColor: '#10b981',
  },
  toggleText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textWhite: {
    color: 'white',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: 'white',
    fontSize: 12,
    marginTop: 6,
  },
  imageSelector: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#334155',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  imageSelectorText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 6,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  chatTitle: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  chatBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  bubbleOwner: {
    backgroundColor: '#10b981',
    alignSelf: 'flex-end',
  },
  bubbleFinder: {
    backgroundColor: '#334155',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 11,
    color: '#e2e8f0',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: 'white',
    fontSize: 11,
  },
  chatSendBtn: {
    backgroundColor: '#6366f1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrSimulation: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  qrText: {
    color: '#818cf8',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  }
});
