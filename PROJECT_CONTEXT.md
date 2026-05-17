# MOVI Project Context

## 1. Product Vision

MOVI is a modern, map-first ride-sharing platform focused on shared auto and cab rides.

The product vision is to make shared mobility feel smarter, cheaper, faster, and more emotionally engaging than traditional ride booking. MOVI is not another Uber, Ola, or Rapido clone. It is a premium mobility experience built around route-based sharing, live ride discovery, and intelligent fare splitting.

MOVI should feel like a real funded startup product from day one: polished, fast, minimal, futuristic, and easy enough for everyday users to trust immediately.

Core promise:

> Book your route. Share the ride. Split the fare.

MOVI should help people move through cities with less cost, less friction, and more connection.

## 2. Brand Identity

MOVI is a mobility brand for modern city riders.

The brand should feel:

- Premium, but not cold
- Futuristic, but not confusing
- Minimal, but not empty
- Youthful, but not childish
- Trustworthy, but not corporate
- Community-driven, but still personal

MOVI should not rely on generic taxi visuals, yellow cab tropes, or copied ride-hailing layouts. The map, route lines, shared movement, fare split moments, and smooth bottom-sheet interactions should become the visual identity.

Suggested brand attributes:

- Name: MOVI
- Tone: sharp, optimistic, confident, urban
- Visual mood: dark-neutral foundation, electric accent colors, clean spacing, crisp typography
- Personality: smart city companion, not a transport utility

## 3. Design Philosophy

MOVI must feel premium and alive. The product should create the impression that sharing a ride is not a compromise, but the smarter choice.

Design direction:

- Map-first interface
- Futuristic bottom sheets
- Minimal screen clutter
- High-contrast readable typography
- Smooth state transitions
- Clear visual distinction between private and shared rides
- Strong fare-saving moments
- Route visuals that make sharing understandable
- Motion used for confidence, not decoration

Avoid:

- Copying Uber, Rapido, Ola, or other ride-hailing apps
- Overcrowded cards
- Generic taxi illustrations
- Heavy gradients everywhere
- Unclear icons
- Too many onboarding screens
- UI that feels like a template

Every screen should answer one question quickly:

> What is happening, what can I do next, and why should I trust this ride?

## 4. UX Principles

MOVI's UX should be fast, calm, and emotionally satisfying.

Primary principles:

- The map is the main surface.
- Booking should feel like building a route, not filling a form.
- Shared rides should feel safe, transparent, and valuable.
- Fare splitting must be visually obvious and easy to understand.
- Users should always know pickup, drop, ETA, ride type, passenger count, and cash payment status.
- The app should minimize typing where possible.
- Primary actions should be large, clear, and thumb-friendly.
- Animations should support progress and confidence.
- Empty states should feel useful, not broken.
- MVP screens should look production-quality even when data is mocked.

Customer trust principles:

- Show route clarity before booking.
- Show estimated fare before confirmation.
- Show passenger count for shared rides.
- Show savings when another passenger joins.
- Show cash payment clearly.
- Avoid hidden charges in the UI language.

## 5. Technical Architecture

MOVI is planned as a React Native Android-first app with a scalable backend architecture.

### Frontend

- React Native
- TypeScript
- Expo
- Zustand for lightweight client state
- React Query for server state and async data
- Mapbox for maps, route display, and location UX
- React Navigation for app navigation
- Reanimated for motion and gesture-driven interactions

### Backend

- Node.js
- Express
- MongoDB
- Socket.io
- Mapbox APIs

### Architecture Layers

```txt
MOVI
├── Mobile App
│   ├── Screens
│   ├── Components
│   ├── Navigation
│   ├── State Stores
│   ├── API Clients
│   ├── Map Services
│   ├── Ride Services
│   └── Shared Ride Logic
│
├── Backend API
│   ├── Ride Management
│   ├── Route Matching
│   ├── Fare Calculation
│   ├── Customer Sessions
│   ├── Driver Matching
│   └── Admin Operations
│
├── Realtime Layer
│   ├── Live Ride Discovery
│   ├── Driver Location Updates
│   ├── Passenger Join Requests
│   ├── Ride Status Updates
│   └── Fare Split Updates
│
└── Data Layer
    ├── Users
    ├── Drivers
    ├── Vehicles
    ├── Rides
    ├── Routes
    ├── Payments
    └── Events
```

For the current MVP, backend behavior can be mocked inside the mobile app while keeping service boundaries clean enough to replace with real APIs later.

## 6. Folder Structure

Recommended project structure:

```txt
movi/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── booking/
│   ├── ride/
│   └── profile/
│
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── map/
│   │   ├── booking/
│   │   ├── ride/
│   │   └── motion/
│   │
│   ├── features/
│   │   ├── booking/
│   │   ├── fares/
│   │   ├── location/
│   │   ├── map/
│   │   ├── privateRide/
│   │   └── sharedRide/
│   │
│   ├── services/
│   │   ├── api/
│   │   ├── mapbox/
│   │   ├── rides/
│   │   ├── fares/
│   │   └── realtime/
│   │
│   ├── store/
│   │   ├── bookingStore.ts
│   │   ├── locationStore.ts
│   │   ├── rideStore.ts
│   │   └── uiStore.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── booking.ts
│   │   ├── fare.ts
│   │   ├── location.ts
│   │   ├── ride.ts
│   │   └── vehicle.ts
│   │
│   └── utils/
│       ├── formatters.ts
│       ├── geo.ts
│       ├── pricing.ts
│       └── validation.ts
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   └── package.json
│
├── PROJECT_CONTEXT.md
├── README.md
├── app.json
├── package.json
└── tsconfig.json
```

If Expo Router is used, route files should live inside `app/`, while reusable business logic remains in `src/`.

## 7. Development Rules

- Build Android-first.
- Keep the customer app as the only current product surface.
- Do not build login until explicitly required.
- Use cash as the only payment mode for MVP.
- Keep Mapbox as the map provider.
- Keep shared ride UX as the core product differentiator.
- Prefer clean mocks over incomplete backend wiring during MVP.
- Keep all ride, fare, and route logic in replaceable service modules.
- Never hard-code product logic directly inside UI components.
- Every screen should feel shippable, even with mock data.
- Do not introduce large abstractions until the product needs them.
- Prioritize perceived speed and UI clarity.
- Avoid adding features that dilute shared ride discovery.

## 8. Shared Ride Logic

Shared rides are MOVI's core feature.

### Concept

A user selects pickup and drop locations. MOVI creates or finds a ride route. Other users traveling in the same direction can discover that route, request to join, and split the fare.

### MVP Logic

For the MVP, shared ride behavior may be simulated with mock route and passenger data.

MVP shared ride rules:

- User chooses pickup and drop.
- User selects Shared Auto or Shared Cab.
- MOVI calculates a base private fare.
- MOVI displays an estimated shared fare.
- MOVI shows route discovery status.
- Mock passengers can appear as route matches.
- Fare is recalculated when passengers join.
- Passenger count is displayed.
- Driver approval is represented as a placeholder.

### Future Real Logic

Production shared ride matching should consider:

- Pickup proximity to active route
- Drop proximity to active route
- Direction similarity
- Route overlap percentage
- Additional detour distance
- Pickup ETA impact
- Passenger count limit
- Vehicle capacity
- Driver acceptance
- Safety constraints
- Fare fairness

### Fare Splitting

Fare splitting should not be a simple equal split unless route usage is equal.

Suggested factors:

- Distance traveled by each passenger
- Shared distance overlap
- Pickup and drop detour
- Vehicle type
- Demand level
- Minimum fare
- Driver earnings protection

Example:

```txt
Private route fare: Rs. 300
Passenger A: Full route
Passenger B: Joins midway and exits before final drop

Updated split:
Passenger A pays Rs. 190
Passenger B pays Rs. 110
Driver receives Rs. 300
```

In the UI, fare reduction should feel rewarding and instant.

## 9. App Flow

### Primary Customer Flow

```txt
Open App
→ Map Home
→ Select Pickup
→ Select Drop
→ Preview Route
→ Choose Private or Shared
→ Choose Auto or Cab
→ View Fare
→ Confirm Cash Ride
→ Searching / Matching
→ Ride Assigned or Shared Ride Created
→ Track Ride Status
→ Complete Ride
→ Ride Summary
```

### Private Ride Flow

```txt
Pickup
→ Drop
→ Private Ride
→ Auto or Cab
→ Fare Estimate
→ Confirm
→ Driver Assigned
```

### Shared Ride Flow

```txt
Pickup
→ Drop
→ Shared Ride
→ Auto or Cab
→ Route Match Search
→ Shared Fare Preview
→ Confirm
→ Passenger Match Updates
→ Fare Split Updates
→ Ride Status
```

### Core Screens

- Splash screen
- Map home screen
- Pickup/drop selection
- Route preview
- Ride option selector
- Booking confirmation
- Shared ride discovery
- Ride status
- Ride summary
- Profile placeholder
- Ride history placeholder

## 10. Future Roadmap

### Phase 1: Customer MVP

- Android-first React Native app
- Mapbox map UX
- Private and shared booking flows
- Mock fare calculation
- Mock shared route discovery
- Cash payment display
- No login
- Premium UI polish

### Phase 2: Backend Foundation

- Node.js and Express API
- MongoDB schemas
- Ride creation APIs
- Fare calculation APIs
- Route matching service
- Socket.io realtime events
- Basic customer session handling

### Phase 3: Driver App

- Driver onboarding
- Vehicle details
- Ride request handling
- Shared passenger queue
- Live location updates
- Cash collection tracking
- Driver earnings

### Phase 4: Production Ride Matching

- Real Mapbox route matching
- Detour calculation
- Route overlap scoring
- Pickup order optimization
- Driver acceptance flow
- Realtime passenger updates

### Phase 5: Trust, Safety, and Payments

- Phone OTP login
- SOS flow
- Share trip
- Ride PIN
- UPI payments
- Wallet
- Ratings
- Support flow

### Phase 6: Growth

- Scheduled shared rides
- Office commute routes
- Student routes
- Airport shared rides
- Women-only shared rides
- Subscription passes
- City-level demand heatmaps

## 11. Coding Standards

- Use TypeScript everywhere.
- Prefer functional React components.
- Keep components small and focused.
- Use explicit types for ride, fare, location, and vehicle models.
- Keep business logic out of screens.
- Use Zustand for local UI and booking state.
- Use React Query for server data.
- Use service modules for Mapbox, rides, fares, and matching.
- Avoid duplicated constants.
- Centralize colors, spacing, typography, and shadows in the theme.
- Use clear file names.
- Use readable names over clever names.
- Keep mock data isolated in dedicated mock files.
- Write code that can later connect to backend APIs without rewriting UI.
- Add comments only for complex product logic, especially fare splitting and route matching.

## 12. UI Consistency Rules

MOVI must look and feel consistent across every screen.

Rules:

- Use a shared theme system.
- Keep spacing consistent.
- Keep border radii consistent.
- Keep button heights consistent.
- Use consistent ride option cards.
- Use consistent bottom-sheet behavior.
- Use consistent map marker styles.
- Use consistent vehicle icons.
- Use clear active, inactive, loading, and disabled states.
- Use motion consistently for panel transitions and ride state changes.
- Do not create one-off visual styles unless the screen has a unique product reason.
- Avoid visual clutter over the map.
- Avoid nested cards.
- Keep all text readable on Android devices.
- Design for thumb reach.
- Primary actions should be obvious within one second.

Preferred UI patterns:

- Map background
- Floating top location summary
- Bottom booking sheet
- Segmented private/shared selector
- Auto/cab option controls
- Fare split module
- Passenger count indicator
- Cash payment pill
- Route status timeline

## 13. Important Instructions for AI Coding Agents

AI coding agents working on MOVI must follow this document as product truth.

Agent rules:

- Do not turn MOVI into a generic taxi booking clone.
- Preserve the shared ride concept as the hero experience.
- Build Android-first unless asked otherwise.
- Use React Native, TypeScript, and Expo.
- Use Mapbox for map-related features.
- Do not add login unless explicitly requested.
- Do not add online payments unless explicitly requested.
- Keep cash payment as the only MVP payment method.
- Use polished, premium UI defaults.
- Keep screens production-quality, not wireframe-like.
- Keep mock logic realistic and easy to replace.
- Do not hide business logic inside UI components.
- Keep route matching and fare splitting modular.
- Favor smooth UX over excessive feature count.
- Respect existing file structure and theme conventions.
- Before adding new dependencies, check whether the existing stack already solves the need.
- Avoid unnecessary refactors.
- Do not remove working UI polish while changing logic.

When uncertain, prioritize:

1. Shared ride clarity
2. Premium user experience
3. Fast booking flow
4. Clean architecture
5. Future backend replaceability

## 14. Current Project Scope

Current scope is the customer mobile app MVP.

Included:

- Customer app only
- Android-first
- React Native with Expo
- TypeScript
- Mapbox map UX
- Private rides
- Shared rides
- Mock route matching
- Mock fare splitting
- Cash payment only
- No login
- Premium UI/UX

Excluded for now:

- Driver app
- Admin panel
- Real authentication
- Online payments
- Real driver dispatch
- Production backend
- Push notifications
- Ratings
- Support chat
- Multi-city operations

The MVP should communicate the full MOVI product story even before all backend systems exist.

## 15. Scalability Goals

MOVI should be designed so the MVP can evolve into a real multi-city mobility platform.

Scalability goals:

- Replace mock ride matching with real backend matching.
- Add Socket.io realtime updates without changing screen architecture.
- Support driver app integration.
- Support passenger join requests.
- Support live driver and passenger location updates.
- Support multiple vehicle types.
- Support different city pricing models.
- Support dynamic shared fare rules.
- Support route-level demand prediction.
- Support future payments without redesigning booking.
- Support safety and trust features.
- Support scheduled and recurring shared rides.
- Support admin operations and analytics.

Technical scalability principles:

- Keep domain models stable.
- Keep service interfaces clean.
- Keep state management predictable.
- Keep UI components reusable.
- Keep map logic isolated.
- Keep pricing logic testable.
- Keep realtime event names consistent.
- Keep backend APIs versionable.

Long-term, MOVI should become a route intelligence platform for shared urban mobility, not just a ride booking app.
