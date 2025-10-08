# Gato Blanco x Gringo Connection - Coffee Shop & Services Platform

A bilingual marketplace connecting Zona Rosa's premier coffee shop with premium gringo services, featuring dynamic pricing and seamless payment integration.

**Experience Qualities**:
1. **Authentic Colombian warmth** - Users feel welcomed into local culture while maintaining familiar conveniences
2. **Effortless bilingual navigation** - Language switching feels natural without losing context or progress
3. **Premium service discovery** - High-value experiences feel exclusive yet accessible to the target market

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple service categories with booking flows, bilingual content management, dynamic pricing based on user type, and integrated payment processing

## Essential Features

### Coffee Shop Menu & Ordering
- **Functionality**: Browse coffee, food items with real-time pricing in USD/COP
- **Purpose**: Drive local revenue while serving as entry point for premium services
- **Trigger**: Landing page prominently features coffee menu
- **Progression**: Browse menu → Select items → Choose pickup/delivery → Payment → Confirmation
- **Success criteria**: Orders process smoothly with accurate pricing conversion

### Service Marketplace
- **Functionality**: Book tourism, Spanish classes, dance lessons, language exchanges
- **Purpose**: High-margin service revenue targeting digital nomads and expats
- **Trigger**: "Services" navigation or coffee checkout upsell
- **Progression**: Browse services → View details → Select date/time → Customer info → Payment → Booking confirmation
- **Success criteria**: Services book successfully with appropriate pricing tiers

### Dynamic Pricing System
- **Functionality**: Automatically adjusts prices based on detected user language/location
- **Purpose**: Maximize revenue from gringo market while remaining accessible to locals
- **Trigger**: Language selection or geolocation detection
- **Progression**: Detect user type → Apply pricing tier → Display appropriate currency/rates
- **Success criteria**: Pricing updates seamlessly without breaking user flow

### CRM Backend
- **Functionality**: Track customers, bookings, revenue by demographic
- **Purpose**: Business intelligence and customer relationship management
- **Trigger**: Admin panel access
- **Progression**: Login → Dashboard → Customer/booking views → Analytics
- **Success criteria**: Clear insights into Colombian vs. Gringo customer patterns

### Payment Integration
- **Functionality**: Accept Apple Pay, credit cards, local payment methods
- **Purpose**: Frictionless transactions for international customers
- **Trigger**: Any purchase/booking checkout
- **Progression**: Select payment method → Enter details → Process → Confirmation
- **Success criteria**: High payment success rate across different customer types

## Edge Case Handling
- **Currency fluctuation**: Daily rate updates with fallback to cached rates
- **Language switching mid-flow**: Preserve cart/form data across language changes
- **Payment failures**: Clear retry paths with alternative payment methods
- **Service unavailability**: Real-time availability checking with alternative suggestions
- **Mobile vs desktop**: Responsive design prioritizing mobile-first experience

## Design Direction

The design should feel like a sophisticated Colombian coffee culture meets modern digital convenience - warm, inviting, and authentically local while maintaining the polish expected by international customers. Rich interface with thoughtful details that celebrate Medellín's vibrant culture.

## Color Selection

Triadic color scheme reflecting Colombian coffee culture with modern digital sophistication.

- **Primary Color**: Rich Coffee Brown (oklch(0.35 0.08 45)) - Communicates authenticity and warmth of Colombian coffee culture
- **Secondary Colors**: 
  - Zona Rosa Pink (oklch(0.75 0.15 15)) - Reflects the neighborhood's vibrant energy
  - Colombian Gold (oklch(0.85 0.12 85)) - Represents premium quality and local pride
- **Accent Color**: Gringo Green (oklch(0.65 0.18 145)) - Attention-grabbing for CTAs and premium services
- **Foreground/Background Pairings**: 
  - Background (Warm Cream oklch(0.96 0.02 65)): Coffee Brown text (oklch(0.35 0.08 45)) - Ratio 5.2:1 ✓
  - Primary (Coffee Brown oklch(0.35 0.08 45)): Cream text (oklch(0.96 0.02 65)) - Ratio 5.2:1 ✓
  - Accent (Gringo Green oklch(0.65 0.18 145)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Card (Pure White oklch(1 0 0)): Coffee Brown text (oklch(0.35 0.08 45)) - Ratio 6.1:1 ✓

## Font Selection

Typography should feel approachable yet sophisticated, reflecting both Colombian warmth and international polish with excellent Spanish diacritical support.

- **Typographic Hierarchy**: 
  - H1 (App Title): Poppins Bold/32px/tight letter spacing
  - H2 (Section Headers): Poppins SemiBold/24px/normal spacing  
  - H3 (Service Names): Poppins Medium/20px/normal spacing
  - Body (Descriptions): Inter Regular/16px/relaxed line height
  - Price (Pricing): Inter Bold/18px/tabular numbers

## Animations

Animations should feel celebratory and warm like Colombian hospitality, with subtle transitions that guide users through the premium service discovery journey.

- **Purposeful Meaning**: Motion communicates Colombian warmth and energy while maintaining professional credibility for high-value services
- **Hierarchy of Movement**: Service cards and pricing updates deserve animation focus as they drive revenue

## Component Selection

- **Components**: Cards for services/menu items, Tabs for language switching, Dialog for booking flows, Select for currency/language, Button with loading states, Form with validation, Badge for pricing tiers
- **Customizations**: Colombian flag color accents on buttons, coffee bean loading animations, custom price display component with currency conversion
- **States**: Hover effects on service cards, loading states during payment processing, success animations for completed bookings
- **Icon Selection**: Coffee cup, location pin, calendar, credit card, language globe, Colombian flag elements
- **Spacing**: Generous padding (p-6) for premium feel, consistent gap-4 for related elements, gap-8 for sections
- **Mobile**: Stack service cards vertically, collapsible navigation, thumb-friendly tap targets, swipe gestures for image galleries