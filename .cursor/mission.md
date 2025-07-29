# 🎯 Mission: Build an interactive spider diagram word cloud tool

This project aims to create a visual word association explorer that helps users brainstorm and explore semantic connections.

## 🕹️ Core Functionality

- User inputs a seed word or phrase (e.g., "survey results")
- The app fetches related terms from a thesaurus API (Datamuse)
- Terms are displayed as a dynamic, interactive graph
- Clicking a word expands more related terms
- Right-clicking a word allows for custom exploration
- Graph view should be zoomable, pannable, and easy to navigate

## 💻 Tech Stack

- React + TypeScript (Vite)
- TailwindCSS + DaisyUI
- react-force-graph
- Datamuse API (and possibly ConceptNet or GPT in future)

## 📦 Initial Milestones

- [ ] Create input field and fetch from Datamuse API
- [ ] Render words as a force-directed graph
- [ ] Click to expand nodes
- [ ] Right-click to custom search
- [ ] Zoom, pan, and keep the root visible
