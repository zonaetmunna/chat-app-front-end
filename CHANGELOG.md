# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Next.js, TypeScript, and Tailwind CSS
- Global CSS with design system variables and Tailwind directives
- Base layout with theme provider and font loading
- Theme provider component using next-themes
- Button component with various styling options
- Utility functions for class name merging and other common operations
- Toast component and hook for notifications
- Home page with hero section and features
- Chat interface components:
  - ChatWindow component for displaying messages
  - ConversationList component for displaying available chats
  - ChatMessage component for individual messages
  - ChatInterface component that combines conversation list and chat window
- User profile components:
  - UserProfile component for displaying user information
  - Settings form for user preferences
- UI components:
  - Label component for form fields
  - Separator component for visual dividers
  - Switch component for toggles
  - Textarea component for multiline input
- Project documentation (README.md)
- Development guidelines and component structure
- This CHANGELOG.md file

### Changed

- Updated TypeScript configuration to use react-jsx mode
- Updated Next.js configuration for better performance
- Removed test files and testing configuration
- Fixed linter errors related to JSX usage

### Fixed

- Resolved JSX compilation issues by updating tsconfig.json
- Fixed icon imports in UserProfile component

## [0.1.0] - 2023-05-12

- Initial project setup and repository creation
