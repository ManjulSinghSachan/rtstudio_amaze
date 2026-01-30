

# Plan: Simplify Landing Page Copy

## Overview
Update the landing page and demo chat component with more inviting, action-focused copy that draws visitors in without jargon.

## Changes

### 1. `src/pages/Landing.tsx`

**Hero Section (lines 43-49):**
| Current | New |
|---------|-----|
| Title: "Relational Tech Studio" | "You can build what you need" |
| Subtitle: "Your space to craft technology that serves your people and place." | "Craft relational tech for your people and place" |

### 2. `src/components/DemoChat.tsx`

**Header Section (lines 75-82):**
| Current | New |
|---------|-----|
| Description: "Your AI partner for building tech that brings neighbors together." | Remove this line entirely |

**Empty State Section (lines 88-90):**
| Current | New |
|---------|-----|
| "Ask about relational tech, explore stories from other neighborhoods, or get help remixing a prompt for your community." | "Ask about relational tech, explore stories from neighborhoods, and get help remixing tools for your community." |

## Result
The landing page will feel more personal and action-oriented:
- **Title** speaks directly to the visitor's capability
- **Subtitle** is concise and clear
- **Demo chat** gets straight to the point with one helpful sentence

## Files Modified
- `src/pages/Landing.tsx` - Hero text updates
- `src/components/DemoChat.tsx` - Simplified intro text

