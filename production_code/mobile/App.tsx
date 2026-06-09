import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Alert,
  StatusBar
} from 'react-native';

// In Expo, import AsyncStorage to implement local persistence caches
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces mapping database specifications
interface HelpItem {
  id: string;
  contactName: string;
  contactPhone: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  province: string;
  district: string;
}

export default function MobileApp() {
  const [lang, setLang] = useState<'np' | 'en'>('np');
  const [activeTab, setActiveTab] = useState<'home' | 'guhar' | 'haat' | 'chat' | 'profile'>('home');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  // Dynamic Datasets state
  const [helpList, setHelpList] = useState<HelpItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState('ढल बन्द वा सडक मर्मत संबन्धी जानकारी वडा नं ४ मा प्रकाशित।');

  // Trigger Local API endpoint
  const API_URL = 'https://api.nepali-family-app.local.np/api';

  useEffect(() => {
    fetchHelpCenter();
  }, []);

  const fetchHelpCenter = async () => {
    setLoading(true);
    try {
      // Offline fallback lists for remote networks
      const fallbackData: HelpItem[] = [
        {
          id: '1',
          contactName: 'दुर्गा प्रसाद',
          contactPhone: '9841234567',
          title: 'कालीगण्डकी अस्पतालको लागि O- नेगेटिभ रगत आवश्यक',
          description: '४ पिन्ट ओ नेगेटिभ आवश्यक। बिरामी आकस्मिक कक्षमा हुनुहुन्छ।',
          category: 'blood',
          urgency: 'critical',
          province: 'Gandaki',
          district: 'Kaski'
        },
        {
          id: '2',
          contactName: 'कमला घिमिरे',
          contactPhone: '9812345600',
          title: 'कृषक हाते ट्रयाक्टर विउ साटासाट व्यवस्था',
          description: 'आफ्नो खेत जोत्नको लागि २ दिनको लागि डिजेल ट्रयाक्टर आवश्यक। बिउ पनि उपलब्ध गराइने छ।',
          category: 'community_help',
          urgency: 'normal',
          province: 'Koshi',
          district: 'Jhapa'
        }
      ];
      setHelpList(fallbackData);
    } catch (e) {
      console.log('Using local offline memory cache due to low network levels.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      Alert.alert('त्रुटि (Error)', 'कृपया १० अंकको सही नेपाली मोबाइल नम्बर राख्नुहोस्।');
      return;
    }
    // Simulate API transport
    setIsOtpSent(true);
    Alert.alert('सफलता (Success)', '६ अंकको कोड एसएमएस पठाइएको छ। (SMS MOCK OTP CODE: 123456)');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456' || otpCode === '654321') {
      setIsLoggedIn(true);
      Alert.alert('स्वागत छ!', 'तपाईं सफलतापूर्वक नेपाली परिवारमा जोडिनुभएको छ।');
    } else {
      Alert.alert('त्रुटि', 'प्रविष्ट कोड मिलेन। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  const handleSosCommand = () => {
    Alert.alert(
      'आकस्मिक सूचना (SOS)',
      'के तपाईं वडा कार्यालय र नजिकका ५० जना छिमेकीहरूलाई आफ्नो स्थानसहित आकस्मिक सहायता (Emergency SOS) सन्देश पठाउन चाहनुहुन्छ?',
      [
        { text: 'रद्द गर्नुहोस् (Cancel)', style: 'cancel' },
        { 
          text: 'पठाउनुहोस् (Send SOS)', 
          onPress: () => {
            Alert.alert('SOS पठाइयो', 'छिमेकीहरूलाई सचेत गराइएको छ र उद्धार समूह सूचित भएको छ।');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const dialContact = (phoneString: string) => {
    Linking.openURL(`tel:${phoneString}`);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.authHeaderBox}>
          <Text style={styles.logoTag}>🇳🇵</Text>
          <Text style={styles.mainTitle}>नेपाली परिवार</Text>
          <Text style={styles.subTitle}>Ek Nepal, Ek Family</Text>
        </View>

        <View style={styles.langSelectorRow}>
          <TouchableOpacity 
            style={[styles.langBtn, lang === 'np' && styles.activeLangBtn]} 
            onPress={() => setLang('np')}
          >
            <Text style={[styles.langText, lang === 'np' && styles.activeLangText]}>नेपाली</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langBtn, lang === 'en' && styles.activeLangBtn]} 
            onPress={() => setLang('en')}
          >
            <Text style={[styles.langText, lang === 'en' && styles.activeLangText]}>English</Text>
          </TouchableOpacity>
        </View>

        {!isOtpSent ? (
          <View style={styles.cardInput}>
            <Text style={styles.fieldLabel}>
              {lang === 'np' ? 'आफ्नो मोबाइल नम्बर राख्नुहोस्:' : 'Enter your mobile phone number:'}
            </Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. 98XXXXXXXX"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.actionBtnBlue} onPress={handleSendOtp}>
              <Text style={styles.actionBtnText}>
                {lang === 'np' ? 'एसएमएस कोड पठाउनुहोस्' : 'Send Verification OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardInput}>
            <Text style={styles.fieldLabel}>
              {lang === 'np' ? '६-अंकको एसएमएस कोड हाल्नुहोस्:' : 'Enter 6-Digit SMS OTP Code:'}
            </Text>
            <TextInput
              style={styles.inputBox}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />
            <TouchableOpacity style={styles.actionBtnGreen} onPress={handleVerifyOtp}>
              <Text style={styles.actionBtnText}>
                {lang === 'np' ? 'सत्यापन गरि साइन-इन गर्नुहोस्' : 'Confirm & Sign In'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textLink} onPress={() => setIsOtpSent(false)}>
              <Text style={styles.linkText}>
                {lang === 'np' ? 'नम्बर परिवर्तन गर्नुहोस्' : 'Change Mobile Number'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Mini App Header */}
      <View style={styles.appHeader}>
        <Text style={styles.appHeaderLogo}>⛰️ नेपाली परिवार</Text>
        <TouchableOpacity style={styles.sosCircleHeader} onPress={handleSosCommand}>
          <Text style={styles.sosTextHeader}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Broadcast news bulletin block */}
      <View style={styles.announcementBar}>
        <Text style={styles.bulletinTicker}>📢 {headline}</Text>
      </View>

      {/* Main Tab Render viewports */}
      <View style={styles.contentArea}>
        {activeTab === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.welcomeSalutation}>
              {lang === 'np' ? 'नमस्ते, नेपाली छिमेकी 👋' : 'Namaste, Local Neighbor 👋'}
            </Text>
            <Text style={styles.levelBadge}>Level 1 Verified Citizen • 🏔️ Pokhara-4</Text>

            {/* Micro Quick Launcher Actions */}
            <View style={styles.quickGrid}>
              <TouchableOpacity style={[styles.gridItem, { borderColor: '#DC2626' }]} onPress={handleSosCommand}>
                <Text style={styles.gridEmoji}>🚨</Text>
                <Text style={[styles.gridTitle, { color: '#DC2626' }]}>आकस्मिक SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridItem} onPress={() => setActiveTab('guhar')}>
                <Text style={styles.gridEmoji}>❤️</Text>
                <Text style={styles.gridTitle}>गुहार केन्द्र</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridItem} onPress={() => setActiveTab('haat')}>
                <Text style={styles.gridEmoji}>🌽</Text>
                <Text style={styles.gridTitle}>हाट बजार</Text>
              </TouchableOpacity>
            </View>

            {/* Offline Alert Placeholder Card */}
            <View style={styles.offlineBoxCard}>
              <Text style={styles.offlineTitle}>⚡ कम डाटा खपत मोड (Low-Data Mode)</Text>
              <Text style={styles.offlineDesc}>
                ग्रामीण क्षेत्रको कमजोर मोबाइल नेटवर्कमा छिटो चल्न यो एप अप्टिमाइज गरिएको छ। सूचना तथा सन्देशहरू चल्नेछन्।
              </Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'guhar' && (
          <View style={styles.fullTabContent}>
            <Text style={styles.tabHeading}>❤️ गुहार केन्द्र (Help Requests)</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#1E3A8A" />
            ) : (
              <FlatList
                data={helpList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.cardHelp}>
                    <View style={styles.cardHelpHeader}>
                      <Text style={[styles.urgencyTag, item.urgency === 'critical' && styles.criticalTag]}>
                        {item.urgency.toUpperCase()}
                      </Text>
                      <Text style={styles.locationTextPin}>📍 {item.district}</Text>
                    </View>
                    <Text style={styles.helpCardTitle}>{item.title}</Text>
                    <Text style={styles.helpCardDesc}>{item.description}</Text>
                    
                    <View style={styles.cardControllerArea}>
                      <Text style={styles.dispatcherName}>{item.contactName} ({item.contactPhone})</Text>
                      <TouchableOpacity style={styles.callCallBtn} onPress={() => dialContact(item.contactPhone)}>
                        <Text style={styles.callText}>📞 कल गर्नुहोस्</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Tab-Stubs (Simming sections) */}
        {activeTab === 'haat' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>🌽 हाat-Bazaar Marketplace</Text>
            <Text style={{ fontSize: 13, color: '#4B5563', marginVertical: 8 }}>
              आफ्नो वडामा बलेका विषादीरहित तरकारी, विउविजन, कृषि कुटो-कोदालो र सरसमान साटासाट तथा विक्रि गर्नुहोस्।
            </Text>
            <View style={styles.offlineBoxCard}>
              <Text style={{ fontWeight: 'bold' }}>🚜 कृषि उपकरण साटासाट र भाडा तिर्ने ठाउँ</Text>
              <Text style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>
                पानी पम्प भाडामा: प्रतिदिन रु ४०० | सम्पर्क: ९८०७५६७XXX
              </Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'chat' && (
          <View style={styles.fullTabContent}>
            <Text style={styles.tabHeading}>💬 चौतारी समूह (Chautari Group Chats)</Text>
            <TouchableOpacity style={styles.offlineBoxCard}>
              <Text style={{ fontWeight: 'bold', color: '#1E3A8A' }}>🏔️ कास्की वडा नं ४ साझा चौतारी</Text>
              <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 4 }}>
                रामप्रसाद: खानेपानीको ट्याङ्कर भोलि बिहान ७ बजे आउँदैछ।
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.tabHeading}>👤 मेरो परिचय (Citizen Profile)</Text>
            <View style={styles.offlineBoxCard}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>शरण कुमार देवकोटा</Text>
              <Text style={{ color: '#4B5563', marginTop: 3 }}>Phone: 98451XXXXX</Text>
              <Text style={{ color: '#4B5563' }}>District: Kaski | Ward: 4</Text>
              <Text style={{ color: '#059669', fontWeight: 'bold', marginTop: 8 }}>Verification: LEVEL 1 (Phone Verified)</Text>
              <Text style={{ color: '#EAB308', fontWeight: 'bold' }}>Reputation Point Index: 10 / 100 🌟</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION TAB-BAR */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('home')}>
          <Text style={[styles.tabEmoji, activeTab === 'home' && styles.activeTabEmoji]}>🏠</Text>
          <Text style={[styles.tabBtnText, activeTab === 'home' && styles.activeTabBtnText]}>गृह</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('guhar')}>
          <Text style={[styles.tabEmoji, activeTab === 'guhar' && styles.activeTabEmoji]}>❤️</Text>
          <Text style={[styles.tabBtnText, activeTab === 'guhar' && styles.activeTabBtnText]}>गुहार</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('haat')}>
          <Text style={[styles.tabEmoji, activeTab === 'haat' && styles.activeTabEmoji]}>🌽</Text>
          <Text style={[styles.tabBtnText, activeTab === 'haat' && styles.activeTabBtnText]}>हाट</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('chat')}>
          <Text style={[styles.tabEmoji, activeTab === 'chat' && styles.activeTabEmoji]}>💬</Text>
          <Text style={[styles.tabBtnText, activeTab === 'chat' && styles.activeTabBtnText]}>चौतारी</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('profile')}>
          <Text style={[styles.tabEmoji, activeTab === 'profile' && styles.activeTabEmoji]}>👤</Text>
          <Text style={[styles.tabBtnText, activeTab === 'profile' && styles.activeTabBtnText]}>प्रोफाइल</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  authHeaderBox: {
    alignItems: 'center',
    marginBottom: 30
  },
  logoTag: {
    fontSize: 50,
    marginBottom: 10
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A'
  },
  subTitle: {
    fontSize: 14,
    color: '#4B5563',
    letterSpacing: 1
  },
  langSelectorRow: {
    flexDirection: 'row',
    marginBottom: 25,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB'
  },
  langBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E5E7EB'
  },
  activeLangBtn: {
    backgroundColor: '#1E3A8A'
  },
  langText: {
    fontWeight: 'bold',
    color: '#374151'
  },
  activeLangText: {
    color: '#FFFFFF'
  },
  cardInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F9FAFB'
  },
  actionBtnBlue: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  actionBtnGreen: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  textLink: {
    alignItems: 'center',
    marginTop: 15
  },
  linkText: {
    color: '#2563EB',
    textDecorationLine: 'underline'
  },
  
  // App navigation viewport states styling
  appContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  appHeader: {
    height: 56,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  appHeaderLogo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sosCircleHeader: {
    backgroundColor: '#DC2626',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sosTextHeader: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  announcementBar: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A'
  },
  bulletinTicker: {
    color: '#78350F',
    fontSize: 12,
    fontWeight: '600'
  },
  contentArea: {
    flex: 1
  },
  scrollContent: {
    padding: 15
  },
  welcomeSalutation: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  levelBadge: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  gridItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    paddingVertical: 15,
    elevation: 1
  },
  gridEmoji: {
    fontSize: 26,
    marginBottom: 6
  },
  gridTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151'
  },
  offlineBoxCard: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    marginBottom: 15
  },
  offlineTitle: {
    fontWeight: 'bold',
    color: '#1E40AF',
    fontSize: 13
  },
  offlineDesc: {
    fontSize: 12,
    color: '#1E3A8A',
    marginTop: 4,
    lineHeight: 16
  },
  fullTabContent: {
    flex: 1,
    padding: 15
  },
  tabHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15
  },
  cardHelp: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 15,
    elevation: 1
  },
  cardHelpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  urgencyTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  criticalTag: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2'
  },
  locationTextPin: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600'
  },
  helpCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6
  },
  helpCardDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12
  },
  cardControllerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 10
  },
  dispatcherName: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600'
  },
  callCallBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  callText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  
  // Navigation Bar Footer
  bottomTabBar: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60
  },
  tabEmoji: {
    fontSize: 18,
    color: '#9CA3AF'
  },
  activeTabEmoji: {
    fontSize: 19
  },
  tabBtnText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600'
  },
  activeTabBtnText: {
    color: '#1E3A8A',
    fontWeight: 'bold'
  }
});
