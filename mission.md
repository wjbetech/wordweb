# 🎯 wordweb. Project Mission

> **Vision**: Create an intuitive, beautiful, and powerful visual word association tool that helps users explore language connections, brainstorm ideas, and discover semantic relationships through interactive graph visualization.

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
- **Dual Input Support**: Primary word + optional focus word for niche exploration
- **Random Discovery**: "Surprise me" functionality for creative exploration
- **Persistent State**: localStorage integration with future project save/load
- **Export Options**: PDF, PNG, SVG export capabilities
- **Responsive Design**: Touch-optimized for mobile, works beautifully on desktop
- **Accessibility**: Screen reader friendly with keyboard navigation
- **Theme System**: Proper DaisyUI light/dark mode with user toggle

## 💻 Technical Foundation

### Current Stack

- **Frontend**: React + TypeScript (Vite)
- **Styling**: TailwindCSS + DaisyUI
- **Visualization**: react-force-graph
- **API**: Datamuse API
- **State Management**: React hooks + custom state management

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

### Phase 2: Core Features 🚧

#### State Management & Persistence

- [ ] **Duplicate Node Prevention**: Prevent clicking same node multiple times, show visual "used" state
- [ ] **Short-term Persistence**: Use localStorage to persist graph state on reload
- [ ] **Loading States**: Show spinners/indicators during API calls
- [ ] **Error Handling**: Graceful handling of API rate limits (500s), disable controls while searching

#### Enhanced Interactions

- [ ] **Node Manipulation**: Allow users to drag/move nodes for custom layouts
- [x] **Node Controls**: Add delete/lock buttons for individual nodes - Delete functionality added to recent searches
- [ ] **Tooltips**: Show frequency scores (DatamuseWord.score) and definitions on hover
- [ ] **Right-click Context Menus**: Custom search options per node

#### UI/UX Improvements

- [x] **Consistent Theming**: Proper DaisyUI light/dark theme implementation - Complete sidebar theming with responsive backgrounds
- [ ] **Theme Toggle**: User-controlled theme switching
- [x] **Zoom and Pan Controls**: Smooth navigation with context preservation - Auto-zoom on initial search

### Phase 3: Enhanced Functionality 📋

#### Core Feature Expansions

- [ ] **Random Word Search**: "Surprise me" functionality for discovery
- [ ] **Dual-Word Input**: Second word for niche/focused exploration
- [ ] **Export Options**: Save to PDF, PNG, SVG formats
- [ ] **Advanced Node States**: Visual indicators for expanded/locked/deleted nodes

#### Performance & Optimization

- [ ] **Mobile Responsiveness**: Touch-optimized interactions
- [ ] **Accessibility Improvements**: Screen reader support, keyboard navigation
- [ ] **Performance Optimizations**: Smooth animations, efficient re-renders
- [ ] **Graph Algorithms**: Smart node positioning and collision detection

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

**Simplicity**: Complex functionality should feel simple
**Clarity**: Visual hierarchy guides user attention
**Responsiveness**: Immediate feedback to all interactions
**Beauty**: Aesthetic design enhances usability

## 🧭 Decision Framework

When making project decisions, ask:

1. **Does this serve our core purpose** of semantic exploration?
2. **Will this improve the user experience** without adding complexity?
3. **Is this technically sound** and maintainable?
4. **Does this align** with our design philosophy?

---

_This mission statement is a living document. Update it as the project evolves to keep the team aligned and focused on delivering value to users._
