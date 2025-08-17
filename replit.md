# Overview

This is a professional web developer portfolio website for "akuthedev" featuring a modern, interactive 3D design with smooth animations and responsive layout. The portfolio showcases web development skills through an engaging single-page application with sections for home, about, skills, and projects. The site emphasizes visual appeal with animated loading screens, theme switching capabilities, and mobile-optimized navigation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without frameworks
- **Class-based JavaScript**: Uses a `PortfolioWebsite` class to encapsulate all functionality and state management
- **Component-based CSS**: Utilizes CSS custom properties (CSS variables) for consistent theming and maintainability
- **Responsive Design**: Mobile-first approach with flexible grid layouts and adaptive navigation
- **Performance Optimizations**: Resource preloading, debounced event handlers, and intersection observers for efficient scrolling

## Visual Design System
- **3D Animations**: Custom CSS animations including a rotating cube loading screen
- **Theme Management**: Comprehensive light/dark theme system using CSS custom properties
- **Color Palette**: Professional color scheme with primary (#6366f1), secondary (#f59e0b), and accent (#10b981) colors
- **Typography Scale**: Systematic font sizing from xs (0.75rem) to 6xl (3.75rem)
- **Spacing System**: Consistent spacing scale from xs (0.25rem) to 3xl (4rem)

## Interactive Features
- **Smooth Scrolling Navigation**: Section-based navigation with active state management
- **Intersection Observer API**: Efficient scroll-triggered animations and section detection
- **Form Validation**: Client-side form validation for contact functionality
- **Mobile Menu**: Collapsible navigation for mobile devices
- **Loading Screen**: 3D animated loading experience with cube rotation

## Code Organization
- **Separation of Concerns**: Clear separation between HTML structure, CSS styling, and JavaScript functionality
- **Event-Driven Architecture**: Centralized event handling with delegation patterns
- **State Management**: Simple state tracking for current section, loading status, and theme preferences
- **Animation Management**: Debounced scroll handlers and animation state tracking to prevent performance issues

# External Dependencies

## Assets
- **Logo/Branding**: Custom SVG logo stored in `assets/logo.svg`
- **Favicon**: SVG-based favicon for modern browser support

## Browser APIs
- **Intersection Observer API**: For scroll-based animations and section detection
- **Local Storage**: Theme preference persistence
- **CSS Custom Properties**: Modern CSS variable support for theming
- **ES6+ Features**: Modern JavaScript features including classes, arrow functions, and destructuring

## Performance Technologies
- **Resource Preloading**: Critical CSS and JavaScript files preloaded for faster initial rendering
- **Debouncing**: Optimized scroll and resize event handling
- **Lazy Loading**: Intersection observers used for performance-conscious animations

The portfolio is designed as a completely self-contained frontend application with no backend dependencies, database requirements, or third-party service integrations. All functionality is implemented using modern web standards and browser APIs.