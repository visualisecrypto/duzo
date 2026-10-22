import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import {
  ACCOUNT_PROFILE_STORAGE_KEY,
  type AccountProfile,
  type AccountType,
} from '@/constants/account';

const C = colors.light;
const logo = require('@/assets/images/duzo-logo.png');
const icon = require('@/assets/images/icon.png');
const categories = ['Agriculture', 'Food & FMCG', 'Building', 'Packaging'];
const businessTypes = [
  'Manufacturer',
  'Wholesaler or distributor',
  'Retailer',
  'Other business',
];

type Stage = 'splash' | 'role' | 'question' | 'complete';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>('splash');
  const [accountType, setAccountType] = useState<AccountType>('buyer');
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [sourcingCategory, setSourcingCategory] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [documentUri, setDocumentUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      AsyncStorage.getItem(ACCOUNT_PROFILE_STORAGE_KEY)
        .then((saved) => {
          if (!active) return;
          if (saved) {
            router.replace('/(tabs)');
          } else {
            setStage('role');
          }
        })
        .catch(() => {
          if (active) setStage('role');
        });
    }, 950);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const questions = useMemo(
    () =>
      accountType === 'buyer'
        ? [
            { title: 'What should we call you?', hint: 'Your name', field: 'name' },
            { title: 'Where are you based?', hint: 'City or state in Nigeria', field: 'location' },
            { title: 'What do you want to source?', hint: 'Choose your main category', field: 'category' },
          ]
        : [
            { title: 'What should we call you?', hint: 'Your name', field: 'name' },
            { title: 'What is your business called?', hint: 'Registered business name', field: 'businessName' },
            { title: 'What best describes your business?', hint: 'Choose one business type', field: 'businessType' },
            { title: 'Where is your business based?', hint: 'City or state in Nigeria', field: 'location' },
            { title: 'What is your CAC registration number?', hint: 'CAC or business registration number', field: 'registration' },
            { title: 'Can you add your CAC certificate?', hint: 'Choose a clear photo of your registration document', field: 'document' },
          ],
    [accountType],
  );

  const isBusiness = accountType === 'business';
  const question = questions[step];
  const stepCount = questions.length;
  const progress = stepCount ? ((step + 1) / stepCount) * 100 : 0;
  const currentAnswer =
    question?.field === 'name'
      ? fullName
      : question?.field === 'businessName'
        ? businessName
        : question?.field === 'businessType'
          ? businessType
          : question?.field === 'location'
            ? location
            : question?.field === 'registration'
              ? registrationNumber
              : question?.field === 'category'
                ? sourcingCategory
                : documentUri ?? 'skip';
  const canContinue =
    question?.field === 'document'
      ? true
      : typeof currentAnswer === 'string' && currentAnswer.trim().length > 0;

  const pickCertificate = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Photo access needed',
          'Allow DuZo to access your photos to attach the business registration certificate.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setDocumentUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Could not open photos', 'Please try selecting the certificate again.');
    }
  };

  const saveOnboarding = async () => {
    setSaving(true);
    const profile: AccountProfile = {
      accountType,
      fullName: fullName.trim(),
      location: location.trim(),
      ...(accountType === 'buyer'
        ? { sourcingCategory }
        : {
            business: {
              name: businessName.trim(),
              description: `${businessType} based in ${location.trim()}.`,
              location: location.trim(),
              businessType,
              registrationNumber: registrationNumber.trim(),
              verificationDocumentUri: documentUri,
              verificationStatus: 'pending' as const,
            },
          }),
    };
    try {
      await AsyncStorage.setItem(ACCOUNT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setStage('complete');
    } catch {
      Alert.alert(
        'Could not save your details',
        'Please try again. Your onboarding details have not been saved.',
      );
    } finally {
      setSaving(false);
    }
  };

  const continueQuestion = () => {
    Keyboard.dismiss();
    if (!canContinue || saving) return;
    if (step < stepCount - 1) {
      setStep((value) => value + 1);
      return;
    }
    void saveOnboarding();
  };

  const goBack = () => {
    if (step > 0) {
      setStep((value) => value - 1);
      return;
    }
    setStage('role');
  };

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  if (stage === 'splash') {
    return (
      <View style={[styles.splash, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
        <StatusBar barStyle="dark-content" backgroundColor={C.background} />
        <Image source={icon} style={styles.splashIcon} resizeMode="contain" />
        <Image source={logo} style={styles.splashLogo} resizeMode="contain" accessibilityLabel="DuZo" />
        <Text style={styles.splashTagline}>Real Businesses. Real Trade.</Text>
        <View style={styles.splashBottom}>
          <View style={styles.splashDot} />
          <Text style={styles.splashCaption}>Built for better trade</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: topPadding, paddingBottom: bottomPadding }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />
      <View style={styles.header}>
        {stage === 'question' ? (
          <Pressable onPress={goBack} style={styles.backButton} accessibilityLabel="Go back">
            <Feather name="arrow-left" size={21} color={C.foreground} />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" accessibilityLabel="DuZo" />
        <View style={styles.backButton} />
      </View>

      {stage === 'role' ? (
        <View style={styles.content}>
          <View style={styles.introIcon}>
            <Feather name="shopping-bag" size={24} color={C.primary} />
          </View>
          <Text style={styles.eyebrow}>WELCOME TO DUZO</Text>
          <Text style={styles.title}>How will you use DuZo?</Text>
          <Text style={styles.subtitle}>Choose the setup that fits you best.</Text>
          <View style={styles.roleOptions}>
            <RoleOption
              title="I’m here to buy"
              subtitle="Find products and trusted suppliers"
              icon="shopping-cart"
              onPress={() => {
                setAccountType('buyer');
                setStep(0);
                setStage('question');
              }}
              testID="onboarding-role-buyer"
            />
            <RoleOption
              title="I’m a business"
              subtitle="Buy and sell on DuZo"
              icon="briefcase"
              business
              onPress={() => {
                setAccountType('business');
                setStep(0);
                setStage('question');
              }}
              testID="onboarding-role-business"
            />
          </View>
          <View style={styles.roleNote}>
            <Feather name="shield" size={15} color="#34754a" />
            <Text style={styles.roleNoteText}>Business accounts complete verification before selling.</Text>
          </View>
        </View>
      ) : stage === 'question' && question ? (
        <View style={styles.questionArea}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {isBusiness ? 'BUSINESS SETUP' : 'BUYER SETUP'}
            </Text>
            <Text style={styles.progressCount}>STEP {step + 1} OF {stepCount}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.questionContent}>
            <Text style={styles.eyebrow}>
              {isBusiness ? 'YOUR BUSINESS' : 'YOUR ACCOUNT'}
            </Text>
            <Text style={styles.title}>{question.title}</Text>
            <Text style={styles.subtitle}>{question.hint}</Text>
            {question.field === 'category' ? (
              <View style={styles.choiceList}>
                {categories.map((item, index) => (
                  <ChoiceRow
                    key={item}
                    label={item}
                    icon={(['sun', 'shopping-bag', 'home', 'box'] as const)[index]}
                    selected={sourcingCategory === item}
                    onPress={() => setSourcingCategory(item)}
                  />
                ))}
              </View>
            ) : question.field === 'businessType' ? (
              <View style={styles.choiceList}>
                {businessTypes.map((item) => (
                  <ChoiceRow
                    key={item}
                    label={item}
                    icon="briefcase"
                    selected={businessType === item}
                    onPress={() => setBusinessType(item)}
                  />
                ))}
              </View>
            ) : question.field === 'document' ? (
              <View style={styles.uploadArea}>
                <Pressable onPress={pickCertificate} style={styles.uploadCard} accessibilityLabel="Choose CAC certificate photo">
                  <View style={styles.uploadIcon}>
                    <Feather name={documentUri ? 'check' : 'image'} size={22} color={documentUri ? '#28804a' : C.primary} />
                  </View>
                  <Text style={styles.uploadTitle}>{documentUri ? 'Certificate added' : 'Choose certificate photo'}</Text>
                  <Text style={styles.uploadSubtitle}>
                    {documentUri ? 'Tap to choose a different photo' : 'JPG or PNG · Keep the document clear'}
                  </Text>
                  {documentUri ? <Feather name="refresh-cw" size={16} color={C.primary} /> : null}
                </Pressable>
                <Text style={styles.uploadDisclaimer}>
                  You can continue without a document, but your business will stay unverified until it is reviewed.
                </Text>
              </View>
            ) : (
              <TextInput
                autoFocus
                value={
                  question.field === 'name'
                    ? fullName
                    : question.field === 'businessName'
                      ? businessName
                      : question.field === 'location'
                        ? location
                        : registrationNumber
                }
                onChangeText={
                  question.field === 'name'
                    ? setFullName
                    : question.field === 'businessName'
                      ? setBusinessName
                      : question.field === 'location'
                        ? setLocation
                        : setRegistrationNumber
                }
                placeholder={question.hint}
                placeholderTextColor="#9aa09c"
                style={styles.answerInput}
                returnKeyType="done"
                onSubmitEditing={continueQuestion}
                accessibilityLabel={question.title}
                autoCapitalize={question.field === 'registration' ? 'characters' : 'words'}
              />
            )}
          </View>
          <View style={styles.footer}>
            <Pressable
              onPress={continueQuestion}
              disabled={!canContinue || saving}
              style={({ pressed }) => [
                styles.continueButton,
                (!canContinue || saving) && styles.continueDisabled,
                pressed && canContinue && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={step === stepCount - 1 ? 'Finish onboarding' : 'Continue'}
              testID="onboarding-continue"
            >
              <Text style={styles.continueText}>
                {saving ? 'Saving…' : step === stepCount - 1 ? 'Finish setup' : 'Continue'}
              </Text>
              <Feather name="arrow-right" size={17} color="#fff" />
            </Pressable>
            <Text style={styles.footerHint}>You can update your details later.</Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.completeIcon}>
            <Feather name={isBusiness ? 'shield' : 'check'} size={27} color="#fff" />
          </View>
          <Text style={styles.eyebrow}>{isBusiness ? 'VERIFICATION STARTED' : 'YOU’RE READY'}</Text>
          <Text style={styles.title}>
            {isBusiness ? 'Your business is under review' : 'Welcome to DuZo'}
          </Text>
          <Text style={styles.subtitle}>
            {isBusiness
              ? 'You can browse and buy now. Selling tools unlock after your business documents are reviewed.'
              : 'Your buyer account is ready. Start sourcing from trusted businesses.'}
          </Text>
          {isBusiness ? (
            <View style={styles.pendingNotice}>
              <Feather name="clock" size={18} color="#a56a14" />
              <Text style={styles.pendingNoticeText}>
                Verification status: Pending review
              </Text>
            </View>
          ) : null}
          <View style={styles.footer}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.continueButton}
              accessibilityRole="button"
              accessibilityLabel="Enter DuZo"
              testID="onboarding-enter"
            >
              <Text style={styles.continueText}>Enter DuZo</Text>
              <Feather name="arrow-right" size={17} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function RoleOption({
  title,
  subtitle,
  icon: iconName,
  business = false,
  onPress,
  testID,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  business?: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.roleOption, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
    >
      <View style={[styles.roleOptionIcon, business && styles.roleOptionIconBusiness]}>
        <Feather name={iconName} size={20} color={business ? '#287747' : C.primary} />
      </View>
      <View style={styles.roleOptionCopy}>
        <Text style={styles.roleOptionTitle}>{title}</Text>
        <Text style={styles.roleOptionSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={19} color="#8b928d" />
    </Pressable>
  );
}

function ChoiceRow({
  label,
  icon: iconName,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceRow, selected && styles.choiceSelected]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <View style={[styles.choiceIcon, selected && styles.choiceIconSelected]}>
        <Feather name={icon} size={17} color={selected ? C.primary : '#57615a'} />
      </View>
      <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  splash: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  splashIcon: { width: 86, height: 86, marginBottom: 15 },
  splashLogo: { width: 146, height: 50 },
  splashTagline: { color: '#646d67', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: -6 },
  splashBottom: { position: 'absolute', bottom: 32, alignItems: 'center', gap: 8 },
  splashDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary },
  splashCaption: { color: '#929993', fontSize: 10, fontFamily: 'Inter_500Medium' },
  header: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 86, height: 30 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 30 },
  introIcon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0e9', marginBottom: 21 },
  eyebrow: { color: C.primary, fontSize: 10, letterSpacing: 1.3, fontFamily: 'Inter_700Bold', marginBottom: 9 },
  title: { color: '#191e1a', fontSize: 27, lineHeight: 33, letterSpacing: -0.7, fontFamily: 'Inter_700Bold' },
  subtitle: { color: '#707972', fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular', marginTop: 8 },
  roleOptions: { gap: 12, marginTop: 27 },
  roleOption: { minHeight: 80, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, paddingVertical: 12, borderWidth: 1, borderColor: '#e6eae7', borderRadius: 15, backgroundColor: '#fff' },
  roleOptionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff1eb' },
  roleOptionIconBusiness: { backgroundColor: '#eaf5ed' },
  roleOptionCopy: { flex: 1, gap: 4 },
  roleOptionTitle: { color: '#202622', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  roleOptionSubtitle: { color: '#78807a', fontSize: 11, fontFamily: 'Inter_400Regular' },
  roleNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 21, padding: 12, borderRadius: 11, backgroundColor: '#f0f7f1' },
  roleNoteText: { flex: 1, color: '#42664a', fontSize: 10, lineHeight: 15, fontFamily: 'Inter_500Medium' },
  questionArea: { flex: 1, paddingHorizontal: 24, paddingTop: 18 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  progressLabel: { color: '#667069', fontSize: 9, letterSpacing: 0.9, fontFamily: 'Inter_600SemiBold' },
  progressCount: { color: '#7d857f', fontSize: 9, fontFamily: 'Inter_500Medium' },
  progressTrack: { height: 4, borderRadius: 4, overflow: 'hidden', backgroundColor: '#e9edea' },
  progressFill: { height: 4, borderRadius: 4, backgroundColor: C.primary },
  questionContent: { flex: 1, paddingTop: 57 },
  answerInput: { minHeight: 56, borderWidth: 1, borderColor: '#dfe5e0', borderRadius: 13, paddingHorizontal: 15, marginTop: 27, color: '#1f2621', fontSize: 15, fontFamily: 'Inter_500Medium', backgroundColor: '#fff' },
  choiceList: { gap: 10, marginTop: 25 },
  choiceRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: '#e5e9e6', backgroundColor: '#fff' },
  choiceSelected: { borderColor: C.primary, backgroundColor: '#fff8f5' },
  choiceIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f6f3' },
  choiceIconSelected: { backgroundColor: '#fff0e9' },
  choiceLabel: { flex: 1, color: '#343c36', fontSize: 12, fontFamily: 'Inter_500Medium' },
  choiceLabelSelected: { color: '#202622', fontFamily: 'Inter_600SemiBold' },
  radio: { width: 19, height: 19, borderWidth: 1.5, borderColor: '#cbd2cc', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: C.primary },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.primary },
  uploadArea: { marginTop: 26 },
  uploadCard: { minHeight: 175, borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd7ce', borderRadius: 15, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: '#f8faf8' },
  uploadIcon: { width: 47, height: 47, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0e9', marginBottom: 11 },
  uploadTitle: { color: '#303932', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  uploadSubtitle: { color: '#858d87', fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 5, marginBottom: 5 },
  uploadDisclaimer: { color: '#7a837c', fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 13, fontFamily: 'Inter_400Regular' },
  footer: { paddingTop: 15, paddingBottom: 12 },
  continueButton: { minHeight: 52, borderRadius: 12, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  continueDisabled: { opacity: 0.45 },
  continueText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  footerHint: { color: '#8a918c', fontSize: 9, textAlign: 'center', marginTop: 10, fontFamily: 'Inter_400Regular' },
  completeIcon: { width: 59, height: 59, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#27804a', marginBottom: 21 },
  pendingNotice: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff7e9', borderRadius: 11, padding: 12, marginTop: 21 },
  pendingNoticeText: { color: '#7b571c', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
