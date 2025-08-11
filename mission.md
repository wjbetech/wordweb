## 🚀 Overhead, SEO, and Polish Improvements (Backlog)

### 1. SEO & Social

- Add a `robots.txt` and `sitemap.xml` for better search engine indexing.
- Use a unique, branded favicon (not the default Vite icon).
- Add a canonical URL meta tag.
- Set a language attribute (`<html lang="en">` is good, but ensure it's correct for your audience).

### 2. Accessibility

- Ensure all interactive elements (buttons, links) have accessible labels and keyboard navigation.
- Add `aria-label` or `aria-*` attributes where needed.
- Check color contrast for accessibility.

### 3. Performance

- Add a `<meta name="theme-color" ...>` for mobile browser theming.
- Use `preconnect` or `dns-prefetch` for external APIs or fonts.
- Optimize images and SVGs (favicon, Open Graph image).

### 4. PWA/Installability

- Add a `manifest.json` for Progressive Web App support (installable on mobile).
- Add a service worker for offline support (optional, but Vite makes this easy).

### 5. Analytics & Monitoring

- Add Google Analytics, Plausible, or another privacy-friendly analytics tool.
- Set up error monitoring (e.g., Sentry) for production.

### 6. User Experience

- Add a loading spinner or skeleton for slow network/API responses.
- Add a "Share" button for social media or direct link sharing.
- Add a "Feedback" or "Contact" link for user suggestions or bug reports.
- Add a "Back to Top" button for long pages.

### 7. Code & Dev Experience

- Add a `README.md` with setup, usage, and contribution instructions.
- Add a `LICENSE` file if you plan to open source.
- Set up automated linting/formatting (Prettier, ESLint).
- Add basic tests (unit or integration) for key components.

### 8. Branding & Trust

- Add a footer with copyright, privacy policy, and terms.
- Add your logo and a short tagline.
- Add a "Powered by React Flow" or similar credit if required by license.

# 🎯 wordweb. Project Mission

> **Vision**: Create an intuitive, beautiful, and powerful visual word association tool that helps users explore language connections, brainstorm ideas, and discover semantic relationships through interactive graph visualization.

## ✅ Status Update — August 2025

- Completed recently:
  - “Surprise me” random word search
  - “Return to Core Word” navigation button
  - Local named saves with Save/Load modals (DaisyUI)
  - Dual-word experiment removed + storage cleanup
  - Edge-cursor fix; major refactor; consistent modal styling
- In progress:
  - Improve Load: hydrate state without full page reload
  - Export/Import JSON of wordwebs
- Next steps (priority):
  1. Hydrate saved state in-app (no reload) by adding a hydrate function in `WordWebFlow` and calling it from `Sidebar`
  2. Export/Import JSON for wordwebs
  3. PNG/SVG export via ReactFlow utilities
  4. Optional: default save-name heuristic (center word + timestamp)

## 🎪 Core Purpose

**wordweb.** aims to dramatically enhance and speed up the way people explore language and prototype ideas across industries by allowing users to very quickly initialize word relationships and build tangible, interactive visual networks. The goal is to bridge the gap between human creativity, discovery and optimization.

### 🎯 Primary Goals

1. **Intuitive Exploration**: Make semantic discovery as natural as browsing the web
2. **Visual Clarity**: Transform complex word relationships into clear, beautiful graphs
3. **Seamless Interaction**: Provide responsive, fluid user experience across all devices
4. **Extensible Architecture**: Build a foundation that can grow with user needs
5. **Optimized Brainstorming**: Create, save and print-to-PDF entire wordmaps to build up your mental framework for your next big project

## 🕹️ Core Functionality

### User Journey

1. **Input**: User enters a seed word or phrase (e.g., "survey results")
2. **Discovery**: App fetches related terms from Datamuse API
3. **Visualization**: Terms appear as an interactive, force-directed graph
4. **Exploration**:
   - Click to expand nodes with related words
   - Right-click for custom search options
   - Hover for word definitions and relationships
5. **Navigation**: Zoom, pan, and maintain context of exploration path

### Key Features

- **Dynamic Graph Rendering**: Smooth, physics-based node positioning with drag/drop support
- **Smart Node Management**: Prevent duplicates, track expansion states, visual "used" indicators
- **Rich Interactions**:
  - Hover tooltips with frequency scores and definitions
  - Right-click context menus for custom actions
  - Drag nodes for custom layouts
  - Lock/delete individual nodes
- **Random Discovery**: "Surprise me" functionality for creative exploration
- **Persistent State**: localStorage integration with future project save/load
- **Local Named Saves**: Save and load multiple named word webs via styled modals
- **Export Options**: PDF, PNG, SVG export capabilities
- **Responsive Design**: Touch-optimized for mobile, works beautifully on desktop
- **Accessibility**: Screen reader friendly with keyboard navigation
- **Theme System**: Proper DaisyUI light/dark mode with user toggle
- **Node Deletion**: Allow users to delete nodes from the current word web (except the core node), for more flexible editing and cleanup.

## 💻 Technical Foundation

### Current Stack ✅

- **Frontend**: React + TypeScript (Vite)
- **Styling**: TailwindCSS + DaisyUI with custom theme system
- **Visualization**: ReactFlow for interactive graph rendering
- **API**: Datamuse API for semantic word relationships
- **State Management**: Custom hooks architecture with modular state management
- **Persistence**: localStorage integration for user preferences and graph state
- **Architecture**: 10 specialized custom hooks handling different application concerns

### Architecture Highlights ✅

- **Component Structure**: 15 focused components with clear responsibilities
- **Custom Hooks System**: Modular state management across 10 specialized hooks
- **Type Safety**: Comprehensive TypeScript with strict typing throughout
- **Performance**: Optimized rendering and state updates through hook architecture
- **Maintainability**: 45% reduction in main component size through systematic refactoring

### Future Considerations

- ConceptNet API integration
- GPT-powered semantic suggestions
- Local storage for user sessions
- Export functionality (PNG, SVG, JSON)

## � Development Principles

### Code Quality

- **Type Safety**: Leverage TypeScript for reliable, maintainable code
- **Strict Typing**: All types defined in `/types` directory, zero `any` usage allowed
- **Type Organization**: Centralized type definitions with clear naming conventions
- **Component Architecture**: Build reusable, testable components
- **Performance**: Optimize for smooth interactions and fast load times
- **Accessibility**: Ensure inclusive design from the start

### Code Modularization & Maintenance ✅

- [x] **Regular Refactoring**: Completed major refactoring reducing WordWebFlow from 782 to 430 lines (45% reduction)
- [x] **File Size Management**: Components maintained under ~400 lines through systematic hook extraction
- [x] **DRY Principles**: Eliminated code duplication through custom hooks and utility extraction
- [x] **Clean Architecture**: Implemented modular hook architecture with clear separation of concerns
- [x] **Style Consistency**: Centralized theme management with DaisyUI integration
- [x] **Component Extraction**: Successfully extracted 10 custom hooks from monolithic component
- [x] **Utility Extraction**: Moved shared logic into dedicated utility functions and custom hooks

### Component Architecture ✅

- **Total Components**: 15 focused components
- **Line Distribution**:
  - WordWebFlow.tsx: 430 lines (main orchestrator)
  - Sidebar.tsx: 378 lines (settings and controls)
  - NodeTooltip.tsx: 213 lines (tooltip system)
  - Other components: 67-141 lines each
- **Custom Hooks**: 10 specialized hooks handling different concerns
- **Total Component Lines**: 1,655 lines across all components

### User Experience

- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile-First**: Design for touch interactions
- **Loading States**: Provide clear feedback during API calls
- **Error Handling**: Graceful degradation when things go wrong

## 📦 Milestone Roadmap

### Phase 1: Foundation ✅

- [x] Project setup with Vite + TypeScript
- [x] Basic UI structure with TailwindCSS
- [x] Datamuse API integration
- [x] Initial graph rendering
- [x] ReactFlow integration for interactive node visualization
- [x] DaisyUI component system integration
- [x] Custom node components with drag/drop functionality

### Phase 2: Core Features ✅ (Complete)

#### State Management & Persistence ✅

- [x] **Duplicate Node Prevention**: Prevent clicking same node multiple times, show visual "used" state
- [x] **Short-term Persistence**: Use localStorage to persist graph state on reload
- [x] **Loading States**: Show spinners/indicators during API calls
- [x] **Error Handling**: Graceful handling of API rate limits (500s), disable controls while searching
- [x] **Advanced State Management**: Custom hooks architecture for modular state management

#### Enhanced Interactions ✅

- [x] **Node Manipulation**: Allow users to drag/move nodes for custom layouts
- [x] **Node Controls**: Delete functionality for nodes and recent searches
- [x] **Tooltips**: Show frequency scores and word information on hover with pin/unpin functionality
- [x] **Interactive Node System**: Click to expand, right-click to pin tooltips
- [x] **Smooth Animations**: Loading overlays and transition states

#### UI/UX Improvements ✅

- [x] **Consistent Theming**: Proper DaisyUI light/dark theme implementation
- [x] **Theme Toggle**: User-controlled theme switching with persistence
- [x] **Zoom and Pan Controls**: Smooth navigation with context preservation and auto-zoom
- [x] **Sidebar Interface**: Collapsible sidebar with search, settings, and controls
- [x] **Modal System**: Confirmation dialogs and user feedback modals
- [x] **Responsive Design**: Mobile-optimized interface with touch support

#### Advanced Architecture ✅

- [x] **Component Refactoring**: Major codebase refactoring reducing WordWebFlow from 782 to 430 lines (45% reduction)
- [x] **Custom Hooks System**: 10 specialized hooks for different concerns:
  - useTooltipState (93 lines) - Tooltip management
  - useModalState (35 lines) - Modal state management
  - useLoadingState (50 lines) - Loading state control
  - useUserPreferences (65 lines) - User preference management
  - useNodeInteraction (185 lines) - Node click and interaction logic
  - useWordWebCreation (125 lines) - Word web creation workflow
  - usePersistence - State persistence
  - useColorPalette - Color management
  - useGraphData - Graph data management
  - useNodePositioning - Node positioning logic
- [x] **Type Safety**: Comprehensive TypeScript implementation with strict typing
- [x] **Code Organization**: Clean separation of concerns across components and hooks

### Phase 3: Enhanced Functionality 🚧 (In Progress)

#### Core Feature Expansions

- [x] **Line Style Customization**: Multiple edge styles (default, straight, smoothstep)
- [x] **Advanced Tooltip System**: Pinnable tooltips with score and tag information
- [x] **Recent Search Management**: Track and manage recent searches with delete functionality
- [x] **Random Word Search**: "Surprise me" functionality for discovery
- [ ] **Export Options**: Save to PDF, PNG, SVG formats
- [x] **Advanced Node States**: Visual indicators for expanded/used states
- [x] **Return to Core Word**: Button to return focus to the center word

#### Persistence UX

- [x] **Named Saves**: Save/Load modals and local named saves in localStorage
- [ ] **Load Without Reload**: Hydrate saved state directly in-app
- [ ] **Export/Import JSON**: Allow users to export/import wordwebs

#### New Priorities (August 2025)

- [ ] **Help & About Modals**: Flesh out the Help and About buttons with modals that explain the app, its development, and the creator.
- [ ] **Settings Panel Functionality**: Make all toggles in the settings panel fully functional and persist user preferences.
- [ ] **Share Panel Functionality**: Implement all sharing/export functions in the Share panel (copy link, export PNG/SVG/PDF/JSON, import JSON, social sharing, etc.).

#### Performance & Optimization ✅

- [x] **Mobile Responsiveness**: Touch-optimized interactions
- [x] **Performance Optimizations**: Smooth animations, efficient re-renders through custom hooks
- [x] **Graph Algorithms**: Smart node positioning and collision detection
- [x] **Memory Management**: Proper state cleanup and optimization
- [x] **Accessibility Improvements**: Keyboard navigation support and screen reader compatibility

### Phase 4: Advanced Features 🔮

#### Long-term Persistence

- [ ] **Project Save/Load**: Backend or IndexedDB implementation
- [ ] **User Sessions**: Named projects, version history
- [ ] **Cloud Sync**: Cross-device synchronization

#### Advanced Capabilities

- [ ] **Multiple API Sources**: ConceptNet, GPT integration
- [ ] **Collaboration Features**: Shared explorations, comments
- [ ] **Analytics & Insights**: Usage patterns, discovery metrics
- [ ] **Advanced Filtering**: Relationship types, word categories, frequency ranges

## 🔮 Future Innovation Tasks

### Advanced User Experience

- [ ] **Search History Graph**: Visual timeline of previous explorations, one-click reload of past graphs
- [ ] **Reverse Search**: Find words that contain the current word in their definitions/meanings
- [ ] **Drag-to-Connect Nodes**: Manual relationship creation between any two nodes
- [ ] **Link Sharing**: Generate shareable URLs for specific word maps and explorations

### Enhanced Customization & Control

- [x] **Tooltip Toggle System**: Allow users to disable/enable tooltips to reduce visual clutter ✅
  - [x] Settings panel toggle for tooltip visibility
  - [x] User preference persistence in localStorage
  - [x] Smooth transition states when toggling on/off
- [ ] **Relevance Filtering**: Enable minimum relevance threshold for word generation
  - Slider control for relevance score requirements (e.g., only "Very Strong" connections)
  - Dynamic filtering based on Datamuse API score values
  - Visual indicators showing current relevance level
- [ ] **Node Connector Customization**: Allow users to toggle between 2 or 4 connectors per node, and choose whether connectors appear on the sides or on the top/bottom of each node
  - Settings panel toggle for connector count (2 or 4)
  - Option to select connector orientation (sides or top/bottom)
  - Node rendering updates dynamically based on user preference

### Export & Sharing Ecosystem

- [ ] **Enhanced Export Suite**:
  - PDF export with high-resolution graphics
  - PNG export with transparent backgrounds
  - Interactive HTML export for embedding
  - Implement `reactflow-export` for professional-quality outputs
- [ ] **Social Sharing**: Direct sharing to social platforms with preview cards
- [ ] **Collaboration Links**: Real-time shared exploration sessions

### Technical Architecture Evolution

- [ ] **Zustand Integration**: Centralized state management across the entire application
  - Replace React hooks with Zustand stores
  - Implement time-travel debugging
  - Optimize re-render performance
- [ ] **Advanced Query System**:
  - Implement React Query or SWR for intelligent API caching
  - Offline-first approach with background sync
  - Predictive pre-fetching based on user patterns
  - Exponential backoff and retry logic

### Backend Infrastructure

- [ ] **Persistent WordWeb Platform**:
  - User authentication and profiles
  - Cloud storage for unlimited word webs
  - Cross-device synchronization
  - Project versioning and history
  - Team collaboration workspaces
- [ ] **API Gateway**: Custom backend aggregating multiple semantic APIs
- [ ] **Analytics Engine**: Usage insights, popular word paths, trend analysis

## 💡 Technical Implementation Notes

### TypeScript Standards

- **Zero `any` Policy**: All types must be explicitly defined in `/types` directory
- **Type Organization**: Logical grouping of interfaces, types, and enums
- **Strict Configuration**: Enable strictest TypeScript compiler options
- **Runtime Type Validation**: Consider implementing runtime type checking for API responses

### State Management Strategy

- **Current**: React hooks + custom state management
- **Evolution Path**: Migrate to Zustand for centralized, performant state management
- **Immediate**: Use `localStorage` for graph state persistence across sessions
- **Future**: Migrate to IndexedDB or backend solution for robust project management
- **Node Tracking**: Maintain expanded/locked/deleted states per node ID

### API & Caching Architecture

- **Current**: Direct fetch calls to Datamuse API
- **Upgrade**: Implement React Query or SWR for intelligent caching
- **Future**: Custom backend aggregating multiple semantic data sources
- **Performance**: Predictive pre-fetching and offline-first approach

### User Experience Patterns

- **Duplicate Prevention**: Track clicked nodes, show subtle visual indicators for "used" states
- **Loading Feedback**: Implement loading states at both node and application level
- **Error Recovery**: Handle API failures gracefully, maintain user context

### DaisyUI Theme Implementation

- Leverage DaisyUI's built-in theme system with proper CSS custom properties
- Implement theme persistence in localStorage
- Ensure consistent theme application across all components

### Performance Considerations

- **API Rate Limiting**: Implement exponential backoff for 500-level errors
- **Node Interactions**: Optimize drag/drop with RAF-based animations
- **Memory Management**: Clean up unused nodes, implement virtual rendering for large graphs

## 🎨 Design Philosophy

**Simplicity**: Complex functionality should feel simple **Clarity**: Visual hierarchy guides user attention **Responsiveness**: Immediate feedback to all interactions **Beauty**: Aesthetic design enhances usability

## 🛠️ Edge Case Work

As we build wordweb., we need to handle various edge cases that could impact user experience or system stability:

### Input Validation & Limits

- [ ] **Handle Long Inputs**: Decide on maximum input length for search terms and implement proper validation
  - Consider UI feedback for character limits
  - Handle truncation vs. rejection of overly long inputs
  - Ensure API compatibility with input length restrictions

### Data & Performance Edge Cases

- [ ] **Empty API Responses**: Handle cases where Datamuse returns no results
- [ ] **Network Failures**: Implement retry logic and offline state handling
- [ ] **Memory Constraints**: Prevent infinite node expansion that could crash the browser
- [ ] **Malformed API Data**: Validate and sanitize all API responses

### User Interaction Edge Cases

- [ ] **Rapid Clicking**: Prevent double-clicks and rapid node expansion requests
- [ ] **Invalid Search Terms**: Handle special characters, emojis, and non-standard input
- [ ] **Browser Compatibility**: Ensure graceful degradation across different browsers
- [ ] **Mobile Touch Events**: Handle touch conflicts with drag/zoom operations

## 🧭 Decision Framework

When making project decisions, ask:

1. **Does this serve our core purpose** of semantic exploration?
2. **Will this improve the user experience** without adding complexity?
3. **Is this technically sound** and maintainable?
4. **Does this align** with our design philosophy?

---

_This mission statement is a living document. Update it as the project evolves to keep the team aligned and focused on delivering value to users._
