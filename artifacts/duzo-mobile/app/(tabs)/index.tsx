import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

const C = colors.light;
const logo = require('@/assets/images/duzo-logo.png');
const farmer = require('@/assets/images/farmer-hero.png');
const maize = require('@/assets/images/yellow-maize.png');

type Role = 'buyer' | 'seller';
type Page = 'tab' | 'product' | 'business' | 'chat' | 'listing';
type BuyerTab =
  | 'Home'
  | 'Explore'
  | 'Categories'
  | 'Orders'
  | 'Inbox'
  | 'Quotes'
  | 'Chat'
  | 'Profile';
type SellerTab = 'Overview' | 'Catalogue' | 'Trade' | 'Inbox' | 'Business';

const categories = [
  { name: 'Agriculture', icon: 'sun', tint: '#f45116' },
  { name: 'Food & FMCG', icon: 'shopping-bag', tint: '#f8faf8' },
  { name: 'Building', icon: 'home', tint: '#f8faf8' },
  { name: 'Packaging', icon: 'box', tint: '#f8faf8' },
];

function Wordmark({ size = 'normal' }: { size?: 'normal' | 'large' }) {
  return (
    <Image
      source={logo}
      resizeMode="contain"
      style={size === 'large' ? styles.logoLarge : styles.logo}
      accessibilityLabel="DuZo"
    />
  );
}

function Verified() {
  return (
    <View style={styles.verifiedIcon}>
      <Feather name="check" size={9} color="#fff" />
    </View>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} style={styles.seeAll}>
          <Text style={styles.seeAllText}>{action}</Text>
          <Feather name="chevron-right" size={15} color={C.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder = 'Search products, suppliers or categories...',
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={18} color="#535a56" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#868b88"
        style={styles.searchInput}
        returnKeyType="search"
        accessibilityLabel="Search marketplace"
      />
      <Feather name="sliders" size={17} color="#313733" />
    </View>
  );
}

function SupplierMark({ small = false }: { small?: boolean }) {
  return (
    <View style={[styles.supplierMark, small && styles.supplierMarkSmall]}>
      <Feather name="hexagon" size={small ? 19 : 24} color="#fff" />
      <Feather
        name="sun"
        size={small ? 12 : 15}
        color="#fff"
        style={styles.markLeaf}
      />
    </View>
  );
}

function ProductImage({ style }: { style?: object }) {
  return <Image source={maize} resizeMode="cover" style={style} />;
}

function PrimaryButton({
  label,
  icon,
  onPress,
  compact = false,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        compact && styles.primaryButtonCompact,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Feather name={icon} size={15} color="#fff" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function OutlineButton({
  label,
  icon,
  onPress,
  compact = false,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outlineButton,
        compact && styles.outlineButtonCompact,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Feather name={icon} size={15} color={C.foreground} /> : null}
      <Text style={styles.outlineButtonText}>{label}</Text>
    </Pressable>
  );
}

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('buyer');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('Home');
  const [sellerTab, setSellerTab] = useState<SellerTab>('Overview');
  const [page, setPage] = useState<Page>('tab');
  const [query, setQuery] = useState('');
  const [profileSection, setProfileSection] = useState('Overview');
  const [favorite, setFavorite] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Hello, I am interested in your Yellow Maize (Grade A).',
    'Thank you for reaching out. We have bulk quantities available.',
  ]);
  const [listingName, setListingName] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingSaved, setListingSaved] = useState(false);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;
  const topPad = Math.max(insets.top, 0) + webTopInset;
  const bottomPad = Math.max(insets.bottom, 0) + webBottomInset;

  const changeTab = (tab: BuyerTab | SellerTab) => {
    setPage('tab');
    if (role === 'buyer') setBuyerTab(tab as BuyerTab);
    else setSellerTab(tab as SellerTab);
  };

  const requestQuote = () => {
    setQuoteSent(true);
    setBuyerTab('Quotes');
    setRole('buyer');
    setPage('tab');
  };

  const filtered = useMemo(
    () =>
      query.trim().length === 0 ||
      'greenfield agro suppliers yellow maize grade a kaduna nigeria'.includes(
        query.toLowerCase(),
      ),
    [query],
  );

  return (
    <View style={[styles.app, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.screen}>
        {page === 'product' ? (
          <ProductScreen
            onBack={() => setPage('tab')}
            onBusiness={() => setPage('business')}
            onQuote={requestQuote}
            onChat={() => setPage('chat')}
            favorite={favorite}
            onFavorite={() => setFavorite((value) => !value)}
          />
        ) : page === 'business' ? (
          <BusinessProfile
            onBack={() => setPage('tab')}
            onQuote={requestQuote}
            onChat={() => setPage('chat')}
            onSwitchMode={() => {
              setRole('buyer');
              setBuyerTab('Home');
              setPage('tab');
            }}
            section={profileSection}
            onSection={setProfileSection}
            onProduct={() => setPage('product')}
          />
        ) : page === 'chat' ? (
          <ChatScreen
            onBack={() => setPage('tab')}
            text={chatText}
            onText={setChatText}
            messages={messages}
            onSend={() => {
              const nextMessage = chatText.trim();
              if (!nextMessage) return;
              setMessages((existing) => [...existing, nextMessage]);
              setChatText('');
            }}
          />
        ) : page === 'listing' ? (
          <CreateListing
            onBack={() => setPage('tab')}
            name={listingName}
            onName={setListingName}
            price={listingPrice}
            onPrice={setListingPrice}
            saved={listingSaved}
            onSave={() => {
              if (listingName.trim() && listingPrice.trim()) {
                setListingSaved(true);
                setSellerTab('Catalogue');
                setPage('tab');
              }
            }}
          />
        ) : role === 'seller' ? (
          <SellerContent
            tab={sellerTab}
            onTab={setSellerTab}
            onListing={() => setPage('listing')}
            onBusiness={() => setPage('business')}
            onProduct={() => setPage('product')}
            onChat={() => setPage('chat')}
            onSwitchMode={() => {
              setRole('buyer');
              setBuyerTab('Home');
              setPage('tab');
            }}
            listingSaved={listingSaved}
            listingName={listingName}
            listingPrice={listingPrice}
          />
        ) : buyerTab === 'Home' ? (
          <BuyerHome
            query={query}
            onQuery={setQuery}
            filtered={filtered}
            onExplore={() => changeTab('Explore')}
            onCategory={() => changeTab('Categories')}
            onProduct={() => setPage('product')}
            onBusiness={() => setPage('business')}
            onQuote={requestQuote}
          />
        ) : buyerTab === 'Explore' ? (
          <BuyerExplore
            query={query}
            onQuery={setQuery}
            onProduct={() => setPage('product')}
            onBusiness={() => setPage('business')}
            onQuote={requestQuote}
            onProfile={() => changeTab('Profile')}
          />
        ) : buyerTab === 'Categories' ? (
          <CategoriesScreen
            onBack={() => changeTab('Explore')}
            onProduct={() => setPage('product')}
            onBusiness={() => setPage('business')}
          />
        ) : buyerTab === 'Orders' ? (
          <OrdersScreen onProduct={() => setPage('product')} />
        ) : buyerTab === 'Quotes' ? (
          <QuotesScreen quoteSent={quoteSent} onProduct={() => setPage('product')} />
        ) : buyerTab === 'Chat' || buyerTab === 'Inbox' ? (
          <ChatScreen
            onBack={() => setBuyerTab('Home')}
            text={chatText}
            onText={setChatText}
            messages={messages}
            onSend={() => {
              const nextMessage = chatText.trim();
              if (!nextMessage) return;
              setMessages((existing) => [...existing, nextMessage]);
              setChatText('');
            }}
          />
        ) : (
          <BuyerProfile
            onSwitch={() => {
              setRole('seller');
              setSellerTab('Overview');
            }}
            onBusiness={() => setPage('business')}
          />
        )}
      </View>
      {page === 'tab' && buyerTab !== 'Chat' && (
        <BottomBar
          role={role}
          active={role === 'buyer' ? buyerTab : sellerTab}
          bottomInset={bottomPad}
          onSelect={changeTab}
        />
      )}
    </View>
  );
}

function BuyerHome({
  query,
  onQuery,
  filtered,
  onExplore,
  onCategory,
  onProduct,
  onBusiness,
  onQuote,
}: {
  query: string;
  onQuery: (value: string) => void;
  filtered: boolean;
  onExplore: () => void;
  onCategory: () => void;
  onProduct: () => void;
  onBusiness: () => void;
  onQuote: () => void;
}) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.homeHeader}>
        <View>
          <Wordmark />
          <Pressable style={styles.locationPill}>
            <Feather name="map-pin" size={12} color={C.foreground} />
            <Text style={styles.locationText}>Port Harcourt, NG</Text>
            <Feather name="chevron-down" size={12} color={C.foreground} />
          </Pressable>
        </View>
        <Pressable style={styles.headerIcon} accessibilityLabel="Notifications">
          <Feather name="bell" size={20} color={C.foreground} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
      <Text style={styles.homeHeadline}>
        Buy better.{'\n'}Trade with <Text style={styles.orange}>trust.</Text>
      </Text>
      <Text style={styles.homeSubhead}>
        Source from verified Nigerian businesses.
      </Text>
      <SearchBar
        value={query}
        onChange={onQuery}
        placeholder="What are you sourcing today?"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((item, index) => (
          <Pressable
            key={item.name}
            onPress={onCategory}
            style={[
              styles.categoryPill,
              index === 0 && styles.categoryPillActive,
            ]}
          >
            <Feather
              name={item.icon as keyof typeof Feather.glyphMap}
              size={16}
              color={index === 0 ? '#fff' : C.foreground}
            />
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive,
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <SectionTitle title="Trusted suppliers for you" action="See all" onAction={onExplore} />
      {filtered ? (
        <>
          <SupplierCard onPress={onBusiness} onProduct={onProduct} />
          <SupplierCard
            second
            onPress={onBusiness}
            onProduct={onProduct}
          />
        </>
      ) : (
        <EmptySearch query={query} />
      )}
      <SectionTitle title="Top deals & bulk prices" action="See all" onAction={onExplore} />
      <ProductCard onPress={onProduct} onQuote={onQuote} />
    </ScrollView>
  );
}

function BuyerExplore({
  query,
  onQuery,
  onProduct,
  onBusiness,
  onQuote,
  onProfile,
}: {
  query: string;
  onQuery: (value: string) => void;
  onProduct: () => void;
  onBusiness: () => void;
  onQuote: () => void;
  onProfile: () => void;
}) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.exploreContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.exploreHeader}>
        <View>
          <Wordmark />
          <Text style={styles.tagline}>Real Businesses. Real Trade.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon}>
            <Feather name="bell" size={19} color={C.foreground} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable onPress={onProfile} style={styles.avatarSmall}>
            <Feather name="user" size={16} color="#39413b" />
          </Pressable>
        </View>
      </View>
      <SearchBar value={query} onChange={onQuery} />
      <ImageBackground
        source={farmer}
        resizeMode="cover"
        imageStyle={styles.promoImage}
        style={styles.promoBanner}
      >
        <View style={styles.promoShade} />
        <View style={styles.promoCopy}>
          <Text style={styles.promoTitle}>Grow your{'\n'}business with{'\n'}trusted suppliers</Text>
          <Text style={styles.promoDescription}>Quality products. Verified businesses.{'\n'}Better trade.</Text>
          <Pressable onPress={onBusiness} style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Explore Now</Text>
            <Feather name="arrow-right" size={13} color="#fff" />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.quickActions}>
        <QuickAction icon="file-text" label="Request\nQuote" onPress={onQuote} />
        <QuickAction icon="search" label="Find\nSuppliers" onPress={onBusiness} />
        <QuickAction icon="clock" label="Compare\nPrices" onPress={onProduct} />
        <QuickAction icon="truck" label="Logistics\nSupport" onPress={onQuote} />
      </View>
      <SectionTitle title="Featured Suppliers" action="See all" onAction={onBusiness} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.supplierCarousel}>
        <FeaturedSupplierCard onPress={onBusiness} />
        <FeaturedSupplierCard second onPress={onBusiness} />
        <FeaturedSupplierCard third onPress={onBusiness} />
      </ScrollView>
      <SectionTitle title="Top Deals & Bulk Prices" action="See all" onAction={onProduct} />
      <ProductCard onPress={onProduct} onQuote={onQuote} />
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <Feather name={icon} size={18} color="#274634" />
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}

function SupplierCard({
  second = false,
  onPress,
  onProduct,
}: {
  second?: boolean;
  onPress: () => void;
  onProduct: () => void;
}) {
  const name = second ? 'PrimeHarvest Foods' : 'GreenField Agro Supplies';
  return (
    <Pressable onPress={onPress} style={styles.supplierCard}>
      <View style={styles.supplierTop}>
        <SupplierMark />
        <View style={styles.supplierInfo}>
          <View style={styles.inline}>
            <Text style={styles.supplierName} numberOfLines={1}>{name}</Text>
            <Verified />
          </View>
          <Text style={styles.verifiedBusiness}>VERIFIED BUSINESS</Text>
          <View style={styles.inline}>
            <Feather name="map-pin" size={11} color="#606762" />
            <Text style={styles.metaText}>{second ? 'Lagos' : 'Kaduna'}, Nigeria</Text>
          </View>
          <View style={styles.inline}>
            <Feather name="star" size={12} color="#f05a24" />
            <Text style={styles.metaText}>{second ? '4.6' : '4.8'}  ·  {second ? '2' : '3'} yrs on Duzo</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={18} color="#777e79" />
      </View>
      <Pressable onPress={onProduct} style={styles.supplierProduct}>
        <ProductImage style={styles.supplierProductImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitleSmall}>{second ? 'Soybeans · Cleaned' : 'Yellow Maize · Grade A'}</Text>
          <Text style={styles.priceSmall}>{second ? '₦620,000' : '₦485,000'} <Text style={styles.perUnit}>/ tonne</Text></Text>
          <View style={styles.inline}>
            <Feather name="package" size={12} color="#737b76" />
            <Text style={styles.metaText}>{second ? 'MOQ 1 tonne' : 'MOQ 2 tonnes'}  ·  3–5 days</Text>
          </View>
          <View style={styles.quoteOutline}>
            <Text style={styles.quoteOutlineText}>Request quote</Text>
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}

function FeaturedSupplierCard({
  second = false,
  third = false,
  onPress,
}: {
  second?: boolean;
  third?: boolean;
  onPress: () => void;
}) {
  const name = third ? 'BuildRight' : second ? 'PrimeHarvest Foods' : 'GreenField Agro Supplies';
  return (
    <Pressable onPress={onPress} style={styles.featuredSupplier}>
      <View style={styles.featuredTop}>
        <SupplierMark small />
        <View style={styles.featuredNameWrap}>
          <View style={styles.inline}>
            <Text style={styles.featuredName} numberOfLines={1}>{name}</Text>
            <Verified />
          </View>
          <Text style={styles.verifiedBusiness}>Verified Business</Text>
        </View>
      </View>
      <Text style={styles.featuredMeta}>★ 4.8  (124)  ·  10+ products</Text>
      <View style={styles.featuredThumbs}>
        <ProductImage style={styles.featuredThumb} />
        <ProductImage style={styles.featuredThumb} />
        <ProductImage style={styles.featuredThumb} />
      </View>
      <Text style={styles.featuredFoot}>Grains · Fertilizers · Agro inputs</Text>
    </Pressable>
  );
}

function ProductCard({
  onPress,
  onQuote,
}: {
  onPress: () => void;
  onQuote: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.dealCard}>
      <ProductImage style={styles.dealImage} />
      <View style={styles.dealDetails}>
        <Text style={styles.discountLabel}>Bulk Discount</Text>
        <Text style={styles.dealTitle}>Yellow Maize (Grade A)</Text>
        <Text style={styles.dealSupplier}>GreenField Agro Supplies</Text>
        <Text style={styles.dealPrice}>₦485,000 <Text style={styles.perUnit}>/ tonne</Text></Text>
        <View style={styles.dealBottom}>
          <View style={styles.discountPill}><Text style={styles.discountText}>Up to 12% off</Text></View>
          <Pressable onPress={onQuote} style={styles.roundArrow}>
            <Feather name="arrow-right" size={15} color="#343a36" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function CategoriesScreen({
  onBack,
  onProduct,
  onBusiness,
}: {
  onBack: () => void;
  onProduct: () => void;
  onBusiness: () => void;
}) {
  const [kind, setKind] = useState<'Products' | 'Suppliers'>('Products');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const productCategories = [
    { name: 'Agriculture & Agro Inputs', icon: 'sun', count: '12,480 products', color: '#248343', tint: '#e8f5e9' },
    { name: 'Grains & Cereals', icon: 'package', count: '3,240 products', color: '#df951b', tint: '#fff5df' },
    { name: 'Fruits & Vegetables', icon: 'sun', count: '2,560 products', color: '#e75e37', tint: '#fff0e8' },
    { name: 'Food & Beverages', icon: 'coffee', count: '4,780 products', color: '#9b7743', tint: '#f7f1e6' },
    { name: 'Industrial Equipment', icon: 'settings', count: '1,920 products', color: '#467ab1', tint: '#e9f1fb' },
    { name: 'Packaging & Processing', icon: 'box', count: '1,540 products', color: '#d98243', tint: '#fff0e5' },
    { name: 'Construction & Building Materials', icon: 'home', count: '3,120 products', color: '#dc9a24', tint: '#fff5df' },
    { name: 'Restaurant & Hospitality', icon: 'grid', count: '1,060 products', color: '#8452a2', tint: '#f3eafd' },
    { name: 'Tools & Hardware', icon: 'tool', count: '2,340 products', color: '#5278a0', tint: '#eaf2fb' },
    { name: 'Logistics & Transportation', icon: 'truck', count: '890 products', color: '#3a8266', tint: '#e8f4ee' },
  ] satisfies {
    name: string;
    icon: keyof typeof Feather.glyphMap;
    count: string;
    color: string;
    tint: string;
  }[];
  const supplierCategories = [
    { name: 'Agriculture & Agro Inputs', icon: 'sun', count: '1,240 suppliers', color: '#248343', tint: '#e8f5e9' },
    { name: 'Grains & Cereals', icon: 'package', count: '486 suppliers', color: '#df951b', tint: '#fff5df' },
    { name: 'Fruits & Vegetables', icon: 'sun', count: '382 suppliers', color: '#e75e37', tint: '#fff0e8' },
    { name: 'Food & Beverages', icon: 'coffee', count: '695 suppliers', color: '#9b7743', tint: '#f7f1e6' },
    { name: 'Industrial Equipment', icon: 'settings', count: '213 suppliers', color: '#467ab1', tint: '#e9f1fb' },
    { name: 'Packaging & Processing', icon: 'box', count: '192 suppliers', color: '#d98243', tint: '#fff0e5' },
    { name: 'Construction & Building Materials', icon: 'home', count: '408 suppliers', color: '#dc9a24', tint: '#fff5df' },
    { name: 'Restaurant & Hospitality', icon: 'grid', count: '146 suppliers', color: '#8452a2', tint: '#f3eafd' },
    { name: 'Tools & Hardware', icon: 'tool', count: '275 suppliers', color: '#5278a0', tint: '#eaf2fb' },
    { name: 'Logistics & Transportation', icon: 'truck', count: '118 suppliers', color: '#3a8266', tint: '#e8f4ee' },
  ] satisfies typeof productCategories;
  const categories = (kind === 'Products' ? productCategories : supplierCategories).filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.categoryPageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.categoryHeader}>
        <Pressable onPress={onBack} accessibilityLabel="Back to Explore"><Feather name="arrow-left" size={20} color={C.foreground} /></Pressable>
        <Text style={styles.categoryHeaderTitle}>Categories</Text>
        <Pressable onPress={() => setSearchOpen((value) => !value)} accessibilityLabel="Search categories"><Feather name="search" size={19} color={C.foreground} /></Pressable>
      </View>
      {searchOpen ? (
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
      ) : null}
      <View style={styles.categoryTypeTabs}>
        {(['Products', 'Suppliers'] as const).map((item) => (
          <Pressable key={item} onPress={() => setKind(item)} style={[styles.categoryTypeTab, kind === item && styles.categoryTypeTabActive]}>
            <Text style={[styles.categoryTypeLabel, kind === item && styles.categoryTypeLabelActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.categoryBrowseHint}>Browse by category to find what you need.</Text>
      {categories.map((item) => (
        <Pressable
          key={item.name}
          onPress={kind === 'Products' ? onProduct : onBusiness}
          style={styles.categoryBrowseRow}
        >
          <View style={[styles.categoryBrowseIcon, { backgroundColor: item.tint }]}>
            <Feather name={item.icon} size={18} color={item.color} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.categoryBrowseName}>{item.name}</Text>
            <Text style={styles.categoryBrowseCount}>{item.count}</Text>
          </View>
          <Feather name="chevron-right" size={17} color="#7b817d" />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function QuotesScreen({
  quoteSent,
  onProduct,
}: {
  quoteSent: boolean;
  onProduct: () => void;
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.simpleHeader}><Wordmark /><Text style={styles.pageTitle}>Your quotes</Text></View>
      <Text style={styles.mutedText}>Track your requests and supplier responses.</Text>
      {quoteSent ? (
        <Pressable onPress={onProduct} style={styles.quoteItem}>
          <View style={styles.quoteIcon}><Feather name="file-text" size={18} color={C.primary} /></View>
          <View style={styles.flex1}>
            <Text style={styles.bodyStrong}>Yellow Maize · Grade A</Text>
            <Text style={styles.mutedSmall}>GreenField Agro Supplies · 2 tonnes</Text>
            <View style={styles.statusRow}><View style={styles.statusDot} /><Text style={styles.statusText}>Sent · Awaiting response</Text></View>
          </View>
          <Feather name="chevron-right" size={18} color="#7b817d" />
        </Pressable>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}><Feather name="file-text" size={24} color={C.primary} /></View>
          <Text style={styles.bodyStrong}>No quote requests yet</Text>
          <Text style={styles.mutedText}>Request a quote from a supplier to start a conversation about pricing and delivery.</Text>
          <OutlineButton label="Browse products" icon="search" onPress={onProduct} />
        </View>
      )}
      <SectionTitle title="Recently viewed" />
      <ProductCard onPress={onProduct} onQuote={onProduct} />
    </ScrollView>
  );
}

function OrdersScreen({ onProduct }: { onProduct: () => void }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.simpleHeader}><Wordmark /><Text style={styles.pageTitle}>Your orders</Text></View>
      <Text style={styles.mutedText}>Follow your orders from confirmation through delivery.</Text>
      <Pressable onPress={onProduct} style={styles.orderCard}>
        <View style={styles.orderCardHeader}>
          <Text style={styles.bodyStrong}>Order #DZ-1048</Text>
          <Text style={styles.orderStatus}>Due today</Text>
        </View>
        <View style={styles.orderProductRow}>
          <ProductImage style={styles.orderImage} />
          <View style={styles.flex1}>
            <Text style={styles.bodyStrong}>Yellow Maize · Grade A</Text>
            <Text style={styles.mutedSmall}>GreenField Agro Supplies</Text>
            <Text style={styles.mutedSmall}>2 tonnes · ₦970,000</Text>
          </View>
          <Feather name="chevron-right" size={17} color="#7b817d" />
        </View>
        <View style={styles.orderProgress}>
          <View style={styles.progressStep}><View style={styles.progressDone}><Feather name="check" size={9} color="#fff" /></View><Text style={styles.progressLabel}>Confirmed</Text></View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}><View style={styles.progressCurrent}><Feather name="truck" size={10} color="#f45116" /></View><Text style={styles.progressLabel}>Dispatch</Text></View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}><View style={styles.progressFuture}><Feather name="package" size={10} color="#858c87" /></View><Text style={styles.progressLabel}>Delivered</Text></View>
        </View>
      </Pressable>
    </ScrollView>
  );
}

function BuyerProfile({
  onSwitch,
  onBusiness,
}: {
  onSwitch: () => void;
  onBusiness: () => void;
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.simpleHeader}><Wordmark /><Text style={styles.pageTitle}>Profile</Text></View>
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}><Feather name="user" size={26} color="#405347" /></View>
        <Text style={styles.profileName}>Chika Okafor</Text>
        <Text style={styles.mutedText}>Buyer account · Port Harcourt, Nigeria</Text>
      </View>
      <Pressable onPress={onSwitch} style={styles.switchSeller}>
        <View style={styles.switchSellerIcon}><Feather name="briefcase" size={19} color="#fff" /></View>
        <View style={styles.flex1}><Text style={styles.bodyStrong}>Open seller dashboard</Text><Text style={styles.mutedSmall}>Manage listings, quotes, and orders</Text></View>
        <Feather name="chevron-right" size={18} color="#7b817d" />
      </Pressable>
      <Pressable onPress={onBusiness} style={styles.categoryListRow}>
        <View style={styles.categoryListIcon}><Feather name="check-circle" size={20} color={C.primary} /></View>
        <View style={styles.flex1}><Text style={styles.bodyStrong}>Business profile</Text><Text style={styles.mutedSmall}>GreenField Agro Supplies</Text></View>
        <Feather name="chevron-right" size={18} color="#7b817d" />
      </Pressable>
      {['Orders & delivery', 'Saved suppliers', 'Settings & support'].map((item) => (
        <Pressable key={item} style={styles.categoryListRow}>
          <View style={styles.categoryListIcon}><Feather name="circle" size={18} color="#78817a" /></View>
          <View style={styles.flex1}><Text style={styles.bodyStrong}>{item}</Text></View>
          <Feather name="chevron-right" size={18} color="#7b817d" />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function ProductScreen({
  onBack,
  onBusiness,
  onQuote,
  onChat,
  favorite,
  onFavorite,
}: {
  onBack: () => void;
  onBusiness: () => void;
  onQuote: () => void;
  onChat: () => void;
  favorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <View style={styles.detailPage}>
      <View style={styles.productPhotoWrap}>
        <ProductImage style={styles.productPhoto} />
        <View style={styles.photoToolbar}>
          <Pressable onPress={onBack} style={styles.photoIcon}><Feather name="arrow-left" size={19} color={C.foreground} /></Pressable>
          <View style={styles.photoRight}>
            <Pressable onPress={onFavorite} style={styles.photoIcon}><Feather name={favorite ? 'heart' : 'heart'} size={19} color={favorite ? C.primary : C.foreground} /></Pressable>
            <Pressable style={styles.photoIcon}><Feather name="share" size={18} color={C.foreground} /></Pressable>
          </View>
        </View>
        <View style={styles.photoCount}><Text style={styles.photoCountText}>1/4</Text></View>
      </View>
      <ScrollView style={styles.productSheet} contentContainerStyle={styles.productSheetInner} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBusiness} style={styles.productSupplier}>
          <SupplierMark small />
          <View style={styles.flex1}>
            <View style={styles.inline}><Text style={styles.supplierName}>GreenField Agro Supplies</Text><Verified /></View>
            <View style={styles.inline}><Feather name="map-pin" size={11} color="#606762" /><Text style={styles.metaText}>Kaduna, Nigeria  ·  3+ yrs on Duzo</Text></View>
          </View>
          <Feather name="chevron-right" size={16} color="#7b817d" />
        </Pressable>
        <Text style={styles.productTitle}>Yellow Maize (Grade A)</Text>
        <Text style={styles.productPrice}>₦485,000 <Text style={styles.perUnit}>/ tonne</Text></Text>
        <View style={styles.productBadges}>
          <Text style={styles.bulkBadge}>Bulk pricing available</Text>
          <Pressable onPress={onQuote} style={styles.linkBadge}><Feather name="file-text" size={13} color="#36617d" /><Text style={styles.linkBadgeText}>Request quote</Text></Pressable>
        </View>
        <View style={styles.productFacts}>
          <Fact icon="truck" label="MOQ" value="2 tonnes" />
          <Fact icon="calendar" label="Lead time" value="3–5 days" />
          <Fact icon="shield" label="Payment terms" value="Net 15 / 30" />
        </View>
        <Pressable style={styles.detailsTitle}><Text style={styles.sectionTitle}>Product details</Text><Feather name="chevron-right" size={18} color={C.foreground} /></Pressable>
        <Text style={styles.bodyCopy}>Premium quality yellow maize, Grade A. Clean, well-packed and suitable for animal feed, food processing and industrial use.</Text>
        <View style={styles.detailSpecs}>
          {[
            ['Grade', 'Grade A'],
            ['Packaging', '50kg bags (or as requested)'],
            ['Origin', 'Kaduna, Nigeria'],
            ['Shelf life', '12 months'],
            ['Available quantity', '500+ tonnes'],
          ].map(([key, value]) => (
            <View key={key} style={styles.specRow}><Text style={styles.specKey}>{key}</Text><Text style={styles.specValue}>{value}</Text></View>
          ))}
        </View>
        <View style={styles.greenNotice}>
          <Feather name="shield" size={18} color="#238247" />
          <View style={styles.flex1}><Text style={styles.noticeTitle}>Looking for a different quantity or packaging?</Text><Text style={styles.noticeCopy}>Send a quote and we'll get back to you.</Text></View>
          <Feather name="chevron-right" size={17} color="#477150" />
        </View>
      </ScrollView>
      <View style={styles.productActions}>
        <OutlineButton label="Chat" icon="message-circle" onPress={onChat} />
        <PrimaryButton label="Request Quote" icon="file-text" onPress={onQuote} />
      </View>
    </View>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.fact}>
      <Feather name={icon} size={17} color="#333a35" />
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function BusinessProfile({
  onBack,
  onQuote,
  onChat,
  onSwitchMode,
  section,
  onSection,
  onProduct,
}: {
  onBack: () => void;
  onQuote: () => void;
  onChat: () => void;
  onSwitchMode: () => void;
  section: string;
  onSection: (value: string) => void;
  onProduct: () => void;
}) {
  const sections = ['Overview', 'Products', 'Reviews', 'Certifications'];
  return (
    <View style={styles.profilePage}>
      <View style={styles.profileHeader}>
        <Pressable onPress={onBack}><Feather name="arrow-left" size={20} color={C.foreground} /></Pressable>
        <Text style={styles.profileHeaderTitle}>Business Profile</Text>
        <View style={styles.inline}>
          <Pressable><Feather name="share" size={18} color={C.foreground} /></Pressable>
          <Pressable onPress={onSwitchMode} style={{ marginLeft: 14 }} accessibilityLabel="Switch to buyer">
            <Feather name="more-vertical" size={18} color={C.foreground} />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.businessContent} showsVerticalScrollIndicator={false}>
        <View style={styles.businessIdentity}>
          <View style={styles.businessLogo}><SupplierMark /></View>
          <View style={styles.businessIdentityCopy}>
            <View style={styles.inline}><Text style={styles.businessName}>GreenField Agro Supplies</Text><Verified /></View>
            <Text style={styles.businessDescription}>Quality agricultural products for a better tomorrow.</Text>
            <View style={styles.inline}>
              <Text style={styles.verifiedBusiness}>VERIFIED BUSINESS</Text>
              <Feather name="map-pin" size={12} color="#5f6963" />
              <Text style={styles.metaText}>Lagos, Nigeria</Text>
            </View>
          </View>
        </View>
        <View style={styles.businessStats}>
          <View style={styles.businessStat}><Text style={styles.statRating}>★ 4.8</Text><Text style={styles.mutedTiny}>(124 reviews)</Text></View>
          <View style={styles.businessStat}><Text style={styles.statValue}><Feather name="calendar" size={13} color={C.foreground} />  3+ years</Text><Text style={styles.mutedTiny}>on Duzo</Text></View>
          <View style={styles.businessStat}><Text style={styles.statValue}><Feather name="shield" size={13} color={C.foreground} />  98%</Text><Text style={styles.mutedTiny}>response rate</Text></View>
        </View>
        <View style={styles.businessActions}>
          <PrimaryButton label="Send Message" icon="message-circle" onPress={onChat} compact />
          <OutlineButton label="Request Quote" icon="file-text" onPress={onQuote} compact />
        </View>
        <View style={styles.profileTabs}>
          {sections.map((item) => (
            <Pressable key={item} onPress={() => onSection(item)} style={[styles.profileTab, section === item && styles.profileTabActive]}>
              <Text style={[styles.profileTabText, section === item && styles.profileTabTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        {section === 'Overview' ? (
          <>
            <Text style={styles.sectionTitle}>About Us</Text>
            <Text style={styles.aboutCopy}>GreenField Agro Supplies is a trusted supplier of high-quality agricultural products, including grains, seeds, fertilizers and farm inputs. We work with local farmers and distributors across Nigeria to ensure consistent supply, competitive pricing and timely delivery.</Text>
            <Pressable style={styles.readMore}><Text style={styles.seeAllText}>Read more</Text><Feather name="chevron-down" size={13} color={C.primary} /></Pressable>
            <View style={styles.verificationCard}>
              <View style={styles.verifiedShield}><Feather name="shield" size={16} color="#fff" /></View>
              <View style={styles.flex1}><Text style={styles.bodyStrong}>Business Verification</Text><Text style={styles.mutedTiny}>Documents verified · KYC completed · Registered Business</Text></View>
              <Feather name="chevron-right" size={17} color="#456f4e" />
            </View>
            <View style={styles.businessDetailsGrid}>
              <BusinessDetail icon="briefcase" label="Business Type" value="Supplier & Distributor" />
              <BusinessDetail icon="calendar" label="Year Established" value="2021" />
              <BusinessDetail icon="credit-card" label="Payment Terms" value="Net 15 / 30" />
              <BusinessDetail icon="truck" label="Delivery Area" value="Nationwide" />
            </View>
            <SectionTitle title="Popular Categories" />
            <View style={styles.popularGrid}>
              {['Maize', 'Soya Beans', 'Fertilizers', 'Agro Inputs'].map((item, index) => (
                <Pressable key={item} onPress={onProduct} style={styles.popularItem}>
                  {index < 2 ? <ProductImage style={styles.popularImage} /> : <View style={styles.popularImageAlt}><Feather name={index === 2 ? 'package' : 'sun'} size={20} color="#4f804e" /></View>}
                  <Text style={styles.popularLabel}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.profileSectionContent}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {section === 'Products' ? (
              <ProductCard onPress={onProduct} onQuote={onQuote} />
            ) : section === 'Reviews' ? (
              <View style={styles.reviewCard}><Text style={styles.statRating}>★ 4.8</Text><Text style={styles.bodyCopy}>“Reliable supplier and the maize quality was excellent. Delivery arrived on time.”</Text><Text style={styles.mutedSmall}>Chinedu A. · Verified buyer</Text></View>
            ) : (
              <View style={styles.verificationCard}><Feather name="award" size={20} color="#267847" /><View style={styles.flex1}><Text style={styles.bodyStrong}>Business registration verified</Text><Text style={styles.mutedSmall}>KYC completed · Nigerian registered business</Text></View></View>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.profileBottomBar}>
        <OutlineButton label="Send Message" icon="message-circle" onPress={onChat} />
        <PrimaryButton label="Request Quote" icon="file-text" onPress={onQuote} />
      </View>
    </View>
  );
}

function BusinessDetail({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.businessDetail}>
      <Feather name={icon} size={14} color="#42617b" />
      <View style={styles.businessDetailCopy}><Text style={styles.mutedTiny}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
    </View>
  );
}

function ChatScreen({
  onBack,
  text,
  onText,
  messages,
  onSend,
}: {
  onBack: () => void;
  text: string;
  onText: (value: string) => void;
  messages: string[];
  onSend: () => void;
}) {
  return (
    <View style={styles.chatPage}>
      <View style={styles.chatHeader}>
        <Pressable onPress={onBack}><Feather name="arrow-left" size={20} color={C.foreground} /></Pressable>
        <SupplierMark small />
        <View style={styles.flex1}><Text style={styles.bodyStrong}>GreenField Agro Supplies</Text><Text style={styles.mutedTiny}>Verified business · Usually replies quickly</Text></View>
        <Feather name="more-vertical" size={18} color={C.foreground} />
      </View>
      <View style={styles.chatContext}>
        <ProductImage style={styles.chatContextImage} />
        <View style={styles.flex1}><Text style={styles.bodyStrong}>Yellow Maize (Grade A)</Text><Text style={styles.mutedSmall}>₦485,000 / tonne</Text></View>
        <Feather name="chevron-right" size={15} color="#777e79" />
      </View>
      <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesInner} showsVerticalScrollIndicator={false}>
        <Text style={styles.chatDate}>TODAY</Text>
        {messages.map((message, index) => (
          <View key={`${message}-${index}`} style={[styles.messageBubble, index % 2 === 0 ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, index % 2 === 0 && styles.myMessageText]}>{message}</Text>
            <Text style={[styles.messageTime, index % 2 === 0 && styles.myMessageText]}>9:41 AM</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatComposer}>
        <Pressable style={styles.composerIcon}><Feather name="plus" size={19} color="#626b65" /></Pressable>
        <TextInput
          value={text}
          onChangeText={onText}
          placeholder="Write a message..."
          placeholderTextColor="#868b88"
          style={styles.composerInput}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <Pressable onPress={onSend} style={styles.sendButton}><Feather name="arrow-up" size={17} color="#fff" /></Pressable>
      </View>
    </View>
  );
}

function CreateListing({
  onBack,
  name,
  onName,
  price,
  onPrice,
  saved,
  onSave,
}: {
  onBack: () => void;
  name: string;
  onName: (value: string) => void;
  price: string;
  onPrice: (value: string) => void;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
      <View style={styles.simpleHeader}>
        <Pressable onPress={onBack}><Feather name="arrow-left" size={20} color={C.foreground} /></Pressable>
        <Text style={styles.pageTitle}>Create product listing</Text>
      </View>
      <Text style={styles.mutedText}>Add the product details buyers need to request a quote.</Text>
      <View style={styles.uploadBox}><Feather name="image" size={23} color={C.primary} /><Text style={styles.bodyStrong}>Add product photos</Text><Text style={styles.mutedSmall}>Choose up to 5 clear product photos</Text></View>
      <Text style={styles.inputLabel}>Product name</Text>
      <TextInput value={name} onChangeText={onName} placeholder="e.g. Yellow Maize · Grade A" style={styles.formInput} />
      <Text style={styles.inputLabel}>Price per tonne (₦)</Text>
      <TextInput value={price} onChangeText={onPrice} placeholder="e.g. 485000" keyboardType="numeric" style={styles.formInput} />
      <Text style={styles.inputLabel}>Minimum order quantity</Text>
      <TextInput placeholder="e.g. 2 tonnes" style={styles.formInput} />
      {saved ? <Text style={styles.successText}>Listing saved to your catalogue.</Text> : null}
      <PrimaryButton label="Save product listing" icon="check" onPress={onSave} />
    </ScrollView>
  );
}

function SellerContent({
  tab,
  onTab,
  onListing,
  onBusiness,
  onProduct,
  onChat,
  onSwitchMode,
  listingSaved,
  listingName,
  listingPrice,
}: {
  tab: SellerTab;
  onTab: (value: SellerTab) => void;
  onListing: () => void;
  onBusiness: () => void;
  onProduct: () => void;
  onChat: () => void;
  onSwitchMode: () => void;
  listingSaved: boolean;
  listingName: string;
  listingPrice: string;
}) {
  if (tab === 'Catalogue') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Your catalogue" onBusiness={onBusiness} />
        <PrimaryButton label="Create product listing" icon="plus" onPress={onListing} />
        <View style={styles.sellerProductCard}>
          <ProductImage style={styles.sellerProductImage} />
          <View style={styles.flex1}><Text style={styles.bodyStrong}>{listingSaved && listingName ? listingName : 'Yellow Maize · Grade A'}</Text><Text style={styles.priceSmall}>₦{listingSaved && listingPrice ? listingPrice : '485,000'} / tonne</Text><Text style={styles.stockText}>● In stock · 24 tonnes</Text></View>
          <Pressable onPress={onProduct}><Feather name="chevron-right" size={18} color="#7b817d" /></Pressable>
        </View>
        <OutlineButton label="Manage catalogue" icon="grid" onPress={onListing} />
      </ScrollView>
    );
  }
  if (tab === 'Trade') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Trade" onBusiness={onBusiness} />
        <Text style={styles.mutedText}>Manage quote requests and incoming orders.</Text>
        <TradeItem icon="file-text" title="Quote request" details="2 tonnes of maize" time="New · 18 min ago" onPress={onProduct} />
        <TradeItem icon="truck" title="Order #DZ-1048" details="Confirm dispatch" time="Due today" onPress={onProduct} />
        <TradeItem icon="file-text" title="Quote request" details="Yellow maize · 10 tonnes" time="Yesterday" onPress={onProduct} />
      </ScrollView>
    );
  }
  if (tab === 'Inbox') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Inbox" onBusiness={onBusiness} />
        <Pressable onPress={onChat} style={styles.quoteItem}><SupplierMark small /><View style={styles.flex1}><Text style={styles.bodyStrong}>Chika Okafor</Text><Text style={styles.mutedSmall}>Is your Grade A maize available in bulk?</Text><Text style={styles.mutedTiny}>18 min ago</Text></View><View style={styles.unreadBadge}><Text style={styles.unreadText}>1</Text></View></Pressable>
      </ScrollView>
    );
  }
  if (tab === 'Business') {
    return <BusinessProfile onBack={() => onTab('Overview')} onQuote={() => onTab('Trade')} onChat={() => onTab('Inbox')} onSwitchMode={onSwitchMode} section="Overview" onSection={() => {}} onProduct={onProduct} />;
  }
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.sellerContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sellerGreeting}>
        <View><View style={styles.inline}><Text style={styles.sellerGreetingText}>Good morning, Chika</Text><Feather name="sun" size={15} color={C.primary} /></View></View>
        <Pressable style={styles.headerIcon}><Feather name="bell" size={19} color={C.foreground} /><View style={styles.notificationDot} /></Pressable>
      </View>
      <Pressable onPress={onBusiness} style={styles.sellerBusinessCard}>
        <SupplierMark />
        <View style={styles.flex1}><View style={styles.inline}><Text style={styles.supplierName}>GreenField Agro Supplies</Text><Verified /></View><Text style={styles.verifiedBusiness}>Verified business</Text></View>
        <Feather name="chevron-right" size={17} color="#7b817d" />
      </Pressable>
      <View style={styles.tradeOverview}>
        <Text style={styles.sectionTitle}>Your trade overview</Text>
        <View style={styles.overviewMetrics}>
          <Metric value="12" label="Open quotes" icon="file-text" />
          <Metric value="8" label="Orders to fulfil" icon="box" />
          <Metric value="₦4.8m" label="Sales this month" icon="trending-up" />
        </View>
      </View>
      <PrimaryButton label="Create product listing" icon="plus" onPress={onListing} />
      <OutlineButton label="Respond to quote requests" icon="message-circle" onPress={() => onTab('Trade')} />
      <SectionTitle title="Needs your attention" />
      <TradeItem icon="file-text" title="Quote request" details="2 tonnes of maize" time="New · 18 min ago" onPress={() => onTab('Trade')} />
      <TradeItem icon="truck" title="Order #DZ-1048" details="Confirm dispatch" time="Due today" onPress={() => onTab('Trade')} />
      <SectionTitle title="Your catalogue" />
      <View style={styles.sellerProductCard}>
        <ProductImage style={styles.sellerProductImage} />
        <View style={styles.flex1}><Text style={styles.bodyStrong}>{listingSaved && listingName ? listingName : 'Yellow Maize · Grade A'}</Text><Text style={styles.priceSmall}>₦{listingSaved && listingPrice ? listingPrice : '485,000'} / tonne</Text><Text style={styles.stockText}>● In stock · 24 tonnes</Text></View>
        <Pressable onPress={onProduct}><Feather name="chevron-right" size={18} color="#7b817d" /></Pressable>
      </View>
      <OutlineButton label="Manage catalogue" icon="grid" onPress={() => onTab('Catalogue')} />
    </ScrollView>
  );
}

function SellerHeader({ title, onBusiness }: { title: string; onBusiness: () => void }) {
  return (
    <View style={styles.sellerSectionHeader}>
      <View><Text style={styles.pageTitle}>{title}</Text><Text style={styles.mutedSmall}>GreenField Agro Supplies</Text></View>
      <Pressable onPress={onBusiness} style={styles.avatarSmall}><Feather name="user" size={16} color="#39413b" /></Pressable>
    </View>
  );
}

function Metric({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Feather name={icon} size={16} color="#303833" />
    </View>
  );
}

function TradeItem({
  icon,
  title,
  details,
  time,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  details: string;
  time: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tradeItem}>
      <View style={[styles.tradeIcon, icon === 'truck' && styles.tradeIconBlue]}><Feather name={icon} size={17} color={icon === 'truck' ? '#3179c7' : C.primary} /></View>
      <View style={styles.flex1}><Text style={styles.bodyStrong}>{title} <Text style={styles.tradeDetails}>· {details}</Text></Text><Text style={styles.mutedSmall}>{time}</Text></View>
      <Feather name="chevron-right" size={18} color="#7b817d" />
    </Pressable>
  );
}

function BottomBar({
  role,
  active,
  bottomInset,
  onSelect,
}: {
  role: Role;
  active: string;
  bottomInset: number;
  onSelect: (tab: BuyerTab | SellerTab) => void;
}) {
  const homeTabs: { name: BuyerTab; icon: keyof typeof Feather.glyphMap }[] = [
    { name: 'Home', icon: 'home' },
    { name: 'Explore', icon: 'search' },
    { name: 'Orders', icon: 'clipboard' },
    { name: 'Inbox', icon: 'mail' },
    { name: 'Profile', icon: 'user' },
  ];
  const exploreTabs: { name: BuyerTab; icon: keyof typeof Feather.glyphMap }[] = [
    { name: 'Home', icon: 'home' },
    { name: 'Explore', icon: 'search' },
    { name: 'Categories', icon: 'grid' },
    { name: 'Quotes', icon: 'file-text' },
    { name: 'Chat', icon: 'message-circle' },
  ];
  const sellerTabs: { name: SellerTab; icon: keyof typeof Feather.glyphMap }[] = [
    { name: 'Overview', icon: 'bar-chart-2' },
    { name: 'Catalogue', icon: 'box' },
    { name: 'Trade', icon: 'repeat' },
    { name: 'Inbox', icon: 'mail' },
    { name: 'Business', icon: 'user' },
  ];
  const tabs =
    role === 'buyer'
      ? active === 'Home'
        ? homeTabs
        : exploreTabs
      : sellerTabs;
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(bottomInset, 8) }]}>
      {tabs.map((tab) => {
        const selected = active === tab.name;
        return (
          <Pressable
            key={tab.name}
            onPress={() => {
              if (role === 'buyer' && (tab.name === 'Chat' || tab.name === 'Inbox')) {
                onSelect('Chat');
                return;
              }
              onSelect(tab.name);
            }}
            style={styles.bottomItem}
            accessibilityRole="button"
            accessibilityLabel={tab.name}
            testID={`tab-${tab.name.toLowerCase()}`}
          >
            <Feather name={tab.icon} size={19} color={selected ? C.primary : '#747b76'} />
            <Text style={[styles.bottomLabel, selected && styles.bottomLabelActive]}>{tab.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <View style={styles.emptySearch}><Feather name="search" size={20} color="#838a85" /><Text style={styles.mutedText}>No suppliers found for “{query}”</Text></View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.background },
  screen: { flex: 1, backgroundColor: C.background },
  scroll: { flex: 1 },
  flex1: { flex: 1 },
  pageContent: { paddingHorizontal: 17, paddingTop: 8, paddingBottom: 24, gap: 12 },
  exploreContent: { paddingHorizontal: 17, paddingTop: 5, paddingBottom: 22, gap: 12 },
  sellerContent: { paddingHorizontal: 17, paddingTop: 4, paddingBottom: 20, gap: 11 },
  logo: { width: 91, height: 31 },
  logoLarge: { width: 114, height: 39 },
  homeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: -1, paddingVertical: 5, paddingHorizontal: 9, borderWidth: 1, borderColor: '#e5e8e6', borderRadius: 15, alignSelf: 'flex-start' },
  locationText: { color: C.foreground, fontSize: 10, fontFamily: 'Inter_500Medium' },
  headerIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', right: 7, top: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary, borderWidth: 1, borderColor: '#fff' },
  homeHeadline: { marginTop: 3, fontSize: 25, lineHeight: 28, fontFamily: 'Inter_700Bold', color: '#171918', letterSpacing: -0.7 },
  orange: { color: C.primary },
  homeSubhead: { color: '#6b716d', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: -5, marginBottom: 1 },
  searchBar: { minHeight: 41, borderWidth: 1, borderColor: '#e4e8e5', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 9, backgroundColor: '#fff' },
  searchInput: { flex: 1, minWidth: 0, fontSize: 11, color: C.foreground, paddingVertical: 8, fontFamily: 'Inter_400Regular' },
  categoryRow: { flexDirection: 'row', gap: 7, paddingRight: 3 },
  categoryPill: { width: 63, height: 57, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#f7f8f7', borderColor: '#eceeec', borderWidth: 1, borderRadius: 10 },
  categoryPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  categoryText: { textAlign: 'center', fontSize: 8, lineHeight: 10, color: '#272d29', fontFamily: 'Inter_500Medium' },
  categoryTextActive: { color: '#fff' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1, marginBottom: -3 },
  sectionTitle: { fontSize: 14, color: '#1b1f1c', fontFamily: 'Inter_700Bold', letterSpacing: -0.2 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  seeAllText: { fontSize: 10, color: C.primary, fontFamily: 'Inter_600SemiBold' },
  supplierCard: { padding: 10, backgroundColor: '#fff', borderColor: '#e8ebe9', borderWidth: 1, borderRadius: 13, gap: 10 },
  supplierTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  supplierMark: { width: 37, height: 37, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24723f', position: 'relative' },
  supplierMarkSmall: { width: 30, height: 30 },
  markLeaf: { position: 'absolute' },
  supplierInfo: { flex: 1, gap: 3 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  supplierName: { fontSize: 10, color: '#202622', fontFamily: 'Inter_700Bold', flexShrink: 1 },
  verifiedIcon: { width: 12, height: 12, borderRadius: 7, backgroundColor: '#1c9a59', alignItems: 'center', justifyContent: 'center' },
  verifiedBusiness: { alignSelf: 'flex-start', color: '#26764b', backgroundColor: '#e7f4e9', fontSize: 7, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, fontFamily: 'Inter_600SemiBold', overflow: 'hidden' },
  metaText: { color: '#6e756f', fontSize: 8, fontFamily: 'Inter_400Regular' },
  supplierProduct: { flexDirection: 'row', gap: 9, borderTopWidth: 1, borderTopColor: '#eef0ee', paddingTop: 9 },
  supplierProductImage: { width: 66, height: 68, borderRadius: 8 },
  productInfo: { flex: 1, gap: 3 },
  productTitleSmall: { fontSize: 10, color: '#323833', fontFamily: 'Inter_500Medium' },
  priceSmall: { fontSize: 12, color: '#151915', fontFamily: 'Inter_700Bold' },
  perUnit: { fontSize: 9, color: '#6d746f', fontFamily: 'Inter_400Regular' },
  quoteOutline: { alignItems: 'center', borderWidth: 1, borderColor: '#ef795a', borderRadius: 7, paddingVertical: 4, marginTop: 1 },
  quoteOutlineText: { color: C.primary, fontSize: 8, fontFamily: 'Inter_600SemiBold' },
  exploreHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagline: { fontSize: 8, color: '#555b57', marginTop: -6, marginLeft: 7, fontFamily: 'Inter_400Regular' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  avatarSmall: { width: 29, height: 29, borderRadius: 16, backgroundColor: '#f0f3f0', alignItems: 'center', justifyContent: 'center' },
  promoBanner: { height: 125, borderRadius: 14, overflow: 'hidden', justifyContent: 'center', backgroundColor: '#305c3e' },
  promoImage: { borderRadius: 14 },
  promoShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,42,27,0.46)' },
  promoCopy: { paddingLeft: 14, paddingVertical: 10, width: '64%' },
  promoTitle: { color: '#fff', fontSize: 16, lineHeight: 18, fontFamily: 'Inter_700Bold', letterSpacing: -0.4 },
  promoDescription: { color: '#edf4ee', fontSize: 8, lineHeight: 11, marginTop: 5, fontFamily: 'Inter_400Regular' },
  promoButton: { flexDirection: 'row', gap: 4, alignItems: 'center', alignSelf: 'flex-start', backgroundColor: C.primary, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 8, marginTop: 7 },
  promoButtonText: { color: '#fff', fontSize: 8, fontFamily: 'Inter_600SemiBold' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 },
  quickAction: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 66, borderRadius: 11, backgroundColor: '#f6f8f6', gap: 5 },
  quickActionText: { textAlign: 'center', color: '#303833', fontSize: 8, lineHeight: 10, fontFamily: 'Inter_500Medium' },
  supplierCarousel: { gap: 8, paddingRight: 5 },
  featuredSupplier: { width: 137, borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 12, padding: 9, gap: 5, backgroundColor: '#fff' },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featuredNameWrap: { flex: 1, minWidth: 0 },
  featuredName: { color: '#222823', fontSize: 8, fontFamily: 'Inter_700Bold', flexShrink: 1 },
  featuredMeta: { fontSize: 7, color: '#737a75', fontFamily: 'Inter_500Medium' },
  featuredThumbs: { flexDirection: 'row', gap: 3 },
  featuredThumb: { flex: 1, height: 39, borderRadius: 5 },
  featuredFoot: { fontSize: 6.5, color: '#727973', fontFamily: 'Inter_400Regular' },
  dealCard: { flexDirection: 'row', borderWidth: 1, borderColor: '#e7eae8', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', minHeight: 119 },
  dealImage: { width: '34%', minHeight: 119 },
  dealDetails: { flex: 1, padding: 10, gap: 3 },
  discountLabel: { color: C.primary, fontSize: 7, fontFamily: 'Inter_600SemiBold' },
  dealTitle: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#202622' },
  dealSupplier: { fontSize: 7, color: '#777e79' },
  dealPrice: { fontSize: 12, fontFamily: 'Inter_700Bold', color: C.foreground },
  dealBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  discountPill: { backgroundColor: '#eaf5ec', paddingVertical: 3, paddingHorizontal: 7, borderRadius: 9 },
  discountText: { fontSize: 7, color: '#277342', fontFamily: 'Inter_600SemiBold' },
  roundArrow: { width: 26, height: 26, borderRadius: 14, backgroundColor: '#f3f5f3', alignItems: 'center', justifyContent: 'center' },
  bottomBar: { minHeight: 56, borderTopColor: '#eceeec', borderTopWidth: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-around', paddingTop: 5 },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 42 },
  bottomLabel: { fontSize: 8, color: '#787f7a', fontFamily: 'Inter_500Medium' },
  bottomLabelActive: { color: C.primary, fontFamily: 'Inter_600SemiBold' },
  simpleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 },
  pageTitle: { fontSize: 19, color: C.foreground, fontFamily: 'Inter_700Bold', letterSpacing: -0.4 },
  categoryListRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#edf0ee' },
  categoryListIcon: { width: 42, height: 42, backgroundColor: '#f1f7f2', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  bodyStrong: { fontSize: 11, color: '#202622', fontFamily: 'Inter_600SemiBold' },
  mutedText: { fontSize: 10, lineHeight: 15, color: '#727a74', fontFamily: 'Inter_400Regular' },
  mutedSmall: { fontSize: 9, color: '#767e78', fontFamily: 'Inter_400Regular', marginTop: 2 },
  mutedTiny: { fontSize: 7, lineHeight: 10, color: '#727a74', fontFamily: 'Inter_400Regular' },
  emptyCard: { padding: 22, alignItems: 'center', gap: 10, borderRadius: 14, backgroundColor: '#f8faf8', borderWidth: 1, borderColor: '#e8ece9' },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff1eb', alignItems: 'center', justifyContent: 'center' },
  quoteItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e8ebe9', backgroundColor: '#fff' },
  quoteIcon: { width: 38, height: 38, borderRadius: 20, backgroundColor: '#fff0e9', alignItems: 'center', justifyContent: 'center' },
  orderCard: { borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 13, padding: 11, gap: 10, backgroundColor: '#fff' },
  orderCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: '#eef0ee' },
  orderStatus: { fontSize: 8, color: '#936416', backgroundColor: '#fff4dd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontFamily: 'Inter_600SemiBold', overflow: 'hidden' },
  orderProductRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  orderImage: { width: 51, height: 50, borderRadius: 7 },
  orderProgress: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderColor: '#eef0ee' },
  progressStep: { alignItems: 'center', gap: 4 },
  progressDone: { width: 20, height: 20, borderRadius: 11, backgroundColor: '#27834a', alignItems: 'center', justifyContent: 'center' },
  progressCurrent: { width: 20, height: 20, borderRadius: 11, backgroundColor: '#fff0e8', alignItems: 'center', justifyContent: 'center' },
  progressFuture: { width: 20, height: 20, borderRadius: 11, backgroundColor: '#f0f2f0', alignItems: 'center', justifyContent: 'center' },
  progressLabel: { fontSize: 7, color: '#707872', fontFamily: 'Inter_500Medium' },
  progressLine: { flex: 1, height: 1, backgroundColor: '#dfe4e0', marginBottom: 11, marginHorizontal: 5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#efa52e' },
  statusText: { fontSize: 8, color: '#747a75', fontFamily: 'Inter_500Medium' },
  profileCard: { alignItems: 'center', padding: 18, borderRadius: 14, backgroundColor: '#f7f9f7', gap: 6 },
  avatarLarge: { width: 62, height: 62, borderRadius: 32, backgroundColor: '#e4eee6', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 16, color: C.foreground, fontFamily: 'Inter_700Bold' },
  switchSeller: { flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 13, backgroundColor: '#f6f8f6', padding: 12 },
  switchSellerIcon: { width: 37, height: 37, borderRadius: 11, backgroundColor: '#287442', alignItems: 'center', justifyContent: 'center' },
  emptySearch: { alignItems: 'center', gap: 8, padding: 20, backgroundColor: '#f8faf8', borderRadius: 12 },
  detailPage: { flex: 1, backgroundColor: '#fff' },
  productPhotoWrap: { height: '33%', minHeight: 210, maxHeight: 300, position: 'relative' },
  productPhoto: { width: '100%', height: '100%' },
  photoToolbar: { position: 'absolute', left: 16, right: 16, top: 6, flexDirection: 'row', justifyContent: 'space-between' },
  photoRight: { flexDirection: 'row', gap: 8 },
  photoIcon: { width: 34, height: 34, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  photoCount: { position: 'absolute', right: 17, bottom: 12, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  photoCountText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_500Medium' },
  productSheet: { flex: 1, marginTop: -14, borderTopLeftRadius: 18, borderTopRightRadius: 18, backgroundColor: '#fff' },
  productSheetInner: { paddingHorizontal: 18, paddingTop: 13, paddingBottom: 10 },
  productSupplier: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eef0ee' },
  productTitle: { marginTop: 11, fontSize: 18, lineHeight: 23, fontFamily: 'Inter_700Bold', color: '#1c211d', letterSpacing: -0.4 },
  productPrice: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#141915', marginTop: 2 },
  productBadges: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  bulkBadge: { fontSize: 8, color: '#327a4b', backgroundColor: '#e7f5ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9, overflow: 'hidden', fontFamily: 'Inter_500Medium' },
  linkBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  linkBadgeText: { fontSize: 9, color: '#45627b', fontFamily: 'Inter_500Medium' },
  productFacts: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#edf0ee', marginTop: 12 },
  fact: { flex: 1, alignItems: 'center', gap: 3, borderRightWidth: 1, borderColor: '#eef0ee' },
  factLabel: { fontSize: 7, color: '#737b75', fontFamily: 'Inter_400Regular' },
  factValue: { fontSize: 8, color: '#272d29', fontFamily: 'Inter_600SemiBold' },
  detailsTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  bodyCopy: { fontSize: 9, lineHeight: 14, color: '#727a74', marginTop: 7, fontFamily: 'Inter_400Regular' },
  detailSpecs: { paddingTop: 9, gap: 7 },
  specRow: { flexDirection: 'row', alignItems: 'center' },
  specKey: { width: '37%', fontSize: 8, color: '#7a817c', fontFamily: 'Inter_400Regular' },
  specValue: { flex: 1, fontSize: 8, color: '#343b36', fontFamily: 'Inter_500Medium' },
  greenNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, marginTop: 12, backgroundColor: '#eaf6ed', borderRadius: 11 },
  noticeTitle: { fontSize: 8, color: '#244b30', fontFamily: 'Inter_600SemiBold' },
  noticeCopy: { fontSize: 7, color: '#5b7660', fontFamily: 'Inter_400Regular', marginTop: 2 },
  productActions: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 17, paddingTop: 9, paddingBottom: 11, borderTopWidth: 1, borderColor: '#eceeec', backgroundColor: '#fff' },
  primaryButton: { minHeight: 42, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, paddingHorizontal: 13 },
  primaryButtonCompact: { flex: 1, minHeight: 39 },
  primaryButtonText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  outlineButton: { minHeight: 42, borderRadius: 9, borderWidth: 1, borderColor: '#cfd4d0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, paddingHorizontal: 13, flex: 1 },
  outlineButtonCompact: { minHeight: 39 },
  outlineButtonText: { color: '#282e2a', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  profilePage: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 17 },
  profileHeaderTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: C.foreground },
  businessContent: { paddingHorizontal: 17, paddingTop: 8, paddingBottom: 16 },
  businessIdentity: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingTop: 7, paddingBottom: 12 },
  businessLogo: { width: 71, height: 71, borderRadius: 38, backgroundColor: '#f0f6f0', borderWidth: 1, borderColor: '#dfe9e0', alignItems: 'center', justifyContent: 'center' },
  businessIdentityCopy: { flex: 1, gap: 5 },
  businessName: { flexShrink: 1, fontSize: 12, color: '#202622', fontFamily: 'Inter_700Bold' },
  businessDescription: { fontSize: 9, lineHeight: 13, color: '#737a75', fontFamily: 'Inter_400Regular' },
  businessStats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eceeec', paddingVertical: 8, marginBottom: 10 },
  businessStat: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 37, borderRightWidth: 1, borderColor: '#eceeec', gap: 3 },
  statRating: { fontSize: 12, color: '#ef5b21', fontFamily: 'Inter_700Bold' },
  statValue: { color: '#272d29', fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  businessActions: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  profileTabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e8ebe9', marginHorizontal: -17, paddingHorizontal: 7, justifyContent: 'space-around' },
  profileTab: { paddingVertical: 10, paddingHorizontal: 7, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  profileTabActive: { borderBottomColor: C.primary },
  profileTabText: { fontSize: 8, color: '#6b726d', fontFamily: 'Inter_500Medium' },
  profileTabTextActive: { color: '#272d29', fontFamily: 'Inter_600SemiBold' },
  aboutCopy: { color: '#515a54', fontSize: 9, lineHeight: 14, marginTop: 7, fontFamily: 'Inter_400Regular' },
  readMore: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 3, marginTop: 5, marginBottom: 10 },
  verificationCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#eff8f0', borderRadius: 10, padding: 10, marginBottom: 9 },
  verifiedShield: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#268044', alignItems: 'center', justifyContent: 'center' },
  businessDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 10, borderWidth: 1, borderColor: '#edf0ee', marginBottom: 12 },
  businessDetail: { width: '50%', minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 9, borderColor: '#edf0ee', borderBottomWidth: 1 },
  businessDetailCopy: { flex: 1 },
  detailValue: { color: '#414943', fontSize: 8, fontFamily: 'Inter_500Medium', marginTop: 1 },
  popularGrid: { flexDirection: 'row', gap: 6, marginTop: 8 },
  popularItem: { flex: 1, alignItems: 'center', gap: 4 },
  popularImage: { width: '100%', height: 51, borderRadius: 8 },
  popularImageAlt: { width: '100%', height: 51, borderRadius: 8, backgroundColor: '#eef6ef', alignItems: 'center', justifyContent: 'center' },
  popularLabel: { fontSize: 7, color: '#373e38', fontFamily: 'Inter_500Medium' },
  profileSectionContent: { paddingTop: 12, gap: 8 },
  reviewCard: { borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 12, padding: 12, gap: 8 },
  profileBottomBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 17, paddingTop: 9, paddingBottom: 10, borderTopWidth: 1, borderColor: '#eceeec' },
  chatPage: { flex: 1, backgroundColor: '#fff' },
  chatHeader: { minHeight: 54, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: '#edf0ee' },
  chatContext: { flexDirection: 'row', alignItems: 'center', gap: 9, margin: 12, padding: 9, backgroundColor: '#f6f8f6', borderRadius: 11 },
  chatContextImage: { width: 43, height: 43, borderRadius: 7 },
  chatMessages: { flex: 1 },
  chatMessagesInner: { padding: 14, gap: 10, justifyContent: 'flex-end', flexGrow: 1 },
  chatDate: { textAlign: 'center', fontSize: 8, color: '#8a908c', marginBottom: 4, fontFamily: 'Inter_500Medium' },
  messageBubble: { maxWidth: '83%', paddingHorizontal: 11, paddingVertical: 9, borderRadius: 13, gap: 5 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: C.primary, borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#f0f3f0', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 10, lineHeight: 15, color: '#252c27', fontFamily: 'Inter_400Regular' },
  myMessageText: { color: '#fff' },
  messageTime: { alignSelf: 'flex-end', fontSize: 7, color: '#7a817c', fontFamily: 'Inter_400Regular' },
  chatComposer: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: '#edf0ee', paddingHorizontal: 13, paddingTop: 9, paddingBottom: 10 },
  composerIcon: { width: 30, height: 34, alignItems: 'center', justifyContent: 'center' },
  composerInput: { flex: 1, minHeight: 38, borderWidth: 1, borderColor: '#e4e8e5', borderRadius: 19, paddingHorizontal: 14, fontSize: 10, color: C.foreground },
  sendButton: { width: 34, height: 34, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  uploadBox: { height: 123, borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd4cd', borderRadius: 13, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#f8faf8', marginTop: 8 },
  inputLabel: { color: '#323a34', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  formInput: { minHeight: 42, borderWidth: 1, borderColor: '#dfe4e0', borderRadius: 9, paddingHorizontal: 11, fontSize: 10, color: C.foreground },
  successText: { color: '#297745', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  sellerGreeting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sellerGreetingText: { fontSize: 15, color: '#202622', fontFamily: 'Inter_700Bold' },
  categoryPageContent: { paddingHorizontal: 16, paddingTop: 7, paddingBottom: 14, gap: 5 },
  categoryHeader: { minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryHeaderTitle: { color: '#202622', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  categoryTypeTabs: { height: 32, flexDirection: 'row', borderRadius: 9, borderWidth: 1, borderColor: '#e5e9e6', backgroundColor: '#f5f7f5', padding: 2, marginTop: 4 },
  categoryTypeTab: { flex: 1, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  categoryTypeTabActive: { backgroundColor: C.primary },
  categoryTypeLabel: { fontSize: 9, color: '#666e68', fontFamily: 'Inter_500Medium' },
  categoryTypeLabelActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  categoryBrowseHint: { color: '#808681', fontSize: 8, fontFamily: 'Inter_400Regular', marginTop: 4, marginBottom: 2 },
  categoryBrowseRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#eef0ee', backgroundColor: '#fff' },
  categoryBrowseIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  categoryBrowseName: { color: '#232a25', fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  categoryBrowseCount: { color: '#858b86', fontSize: 7, fontFamily: 'Inter_400Regular', marginTop: 2 },
  sellerBusinessCard: { flexDirection: 'row', gap: 9, alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: '#f7f9f7', borderWidth: 1, borderColor: '#edf0ee' },
  tradeOverview: { borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 12, padding: 11, gap: 12 },
  overviewMetrics: { flexDirection: 'row' },
  metric: { flex: 1, minHeight: 69, alignItems: 'center', justifyContent: 'center', gap: 4, borderRightWidth: 1, borderColor: '#edf0ee' },
  metricValue: { fontSize: 15, color: '#1d231e', fontFamily: 'Inter_700Bold' },
  metricLabel: { textAlign: 'center', fontSize: 7, color: '#777e79', fontFamily: 'Inter_400Regular' },
  tradeItem: { minHeight: 51, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 9, paddingVertical: 7, borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 10, backgroundColor: '#fff' },
  tradeIcon: { width: 32, height: 32, borderRadius: 17, backgroundColor: '#fff1e9', alignItems: 'center', justifyContent: 'center' },
  tradeIconBlue: { backgroundColor: '#e9f2fe' },
  tradeDetails: { color: '#6e756f', fontSize: 9, fontFamily: 'Inter_400Regular' },
  sellerProductCard: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 8, borderWidth: 1, borderColor: '#e8ebe9', borderRadius: 10 },
  sellerProductImage: { width: 57, height: 55, borderRadius: 7 },
  stockText: { fontSize: 8, color: '#33804e', fontFamily: 'Inter_500Medium', marginTop: 3 },
  sellerSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 46 },
  unreadBadge: { width: 17, height: 17, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: '#fff', fontSize: 8, fontFamily: 'Inter_700Bold' },
});
