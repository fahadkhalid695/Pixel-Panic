# Pixel Panic UI/UX Design Specification

## Purpose
This document defines the complete user interface and user experience specification for Pixel Panic, a modern pixel-art online multiplayer browser game. It covers every major screen, the visual language, motion system, interaction patterns, responsive rules, and mobile adaptation strategy.

The goal is to create an interface that feels retro-inspired, clean, and instantly understandable, while still supporting a modern competitive multiplayer experience with social systems, progression, cosmetics, and live-service features.

---

## 1. UI/UX Design Principles
Pixel Panic UI should feel like a premium modern arcade cabinet translated into a browser-native product. It must be visually charming, fast to navigate, and readable in both desktop and mobile contexts.

### Core Principles
- **Clarity first**: Every important action should be obvious at a glance.
- **Arcade energy**: The UI should feel lively, playful, and game-like rather than corporate.
- **Retro-modern balance**: Pixel art and blocky forms are paired with polished spacing, motion, and layout discipline.
- **Touch-friendly**: All screens must work cleanly on phones and tablets.
- **Low-friction flow**: Players should reach a match with minimal steps.
- **Social visibility**: Friends, party status, and rewards should be easy to spot.
- **Competitive readability**: Game HUD and menus should never hide key match information.

### Experience Goals
- New players should understand the UI within one session.
- Returning players should navigate to queue, party, or shop in one or two taps/clicks.
- No screen should feel overloaded on a small display.
- Motion should support feedback, not distract from function.

---

## 2. Visual Language
The visual language should combine retro pixel styling with modern UI polish.

### Overall Style Direction
- Pixel-inspired shapes and iconography.
- Clean panels with crisp borders.
- Rounded-square containers for touch comfort.
- Bright accent colors with dark neutral surfaces.
- Subtle scanline, glow, or CRT-inspired textures used sparingly.
- Animated pixel dust, spark bursts, and soft hover glow for feedback.

### UI Personality
- Energetic but not chaotic.
- Playful but not childish.
- Competitive but not aggressive.
- Modern but clearly inspired by arcade and retro console menus.

### Panel Design
- Panels should use layered depth with a dark base, highlighted edge, and inner surface tint.
- Cards and modals should feel tactile through shadows, outlines, and animated edge glints.
- Large primary actions should be visually dominant.

---

## 3. Color Palette
The palette should support dark-mode-first presentation with strong arcade contrast.

### Primary Palette
- **Background Deep Navy**: `#0C1020`
- **Panel Slate**: `#151C33`
- **Panel Highlight**: `#223056`
- **Neon Cyan**: `#42E8F5`
- **Neon Mint**: `#57F287`
- **Arcade Yellow**: `#FFD84D`
- **Hot Coral**: `#FF5D7A`
- **Victory Gold**: `#F6C85F`
- **Defeat Violet-Blue**: `#6B7CFF`
- **Text Primary**: `#F4F7FF`
- **Text Secondary**: `#AAB3D6`
- **Text Muted**: `#6F789A`

### Semantic Colors
- Success: mint or green.
- Warning: yellow or amber.
- Danger: coral or red.
- Information: cyan.
- Ranked status: gold and blue gradients.

### Color Rules
- Color must never be the only method of conveying state.
- Critical warnings should have both color and shape cues.
- Backgrounds should remain dark enough for readable neon accents.
- Bright colors should be used as highlights, not as full-screen floods.

---

## 4. Typography
Typography should be modern and highly readable, not novelty pixel fonts for body text.

### Typographic Strategy
- Use a clean sans-serif family for body and UI labels.
- Use a pixel-inspired or stylized display font only for titles, logos, or special labels.
- Keep body text highly legible on mobile.

### Recommended Type Roles
- **Title / Logo**: bold display font with subtle pixel-edged character.
- **Section headers**: condensed or semi-bold sans-serif.
- **Body text**: readable UI sans-serif.
- **Stats and numbers**: tabular figures, highly legible.

### Typographic Hierarchy
- Title screens should feel bold and memorable.
- Menus should prioritize large, readable button labels.
- Secondary descriptions should never overpower actions.

### Typographic Rules
- Avoid tiny body text.
- Keep line length short in side panels.
- Use uppercase sparingly for emphasis only.
- Numeric stats should be aligned and easy to compare.

---

## 5. Icon Style
Icons should be simple, pixel-friendly, and immediately recognizable.

### Icon Direction
- Use geometric, high-contrast icons with limited detail.
- Maintain a consistent stroke or pixel-edge language.
- Prefer silhouettes over realistic detail.
- Use color accents to distinguish categories.

### Icon Categories
- Navigation icons.
- Currency icons.
- Social icons.
- Progress icons.
- Reward icons.
- Match status icons.
- Settings icons.

### Icon Rules
- Every icon must read at small size.
- Avoid overly thin lines.
- Maintain consistent padding and bounding shape.
- Animated states can use glow, pulse, or sparkle but should remain minimal.

---

## 6. Spacing and Layout
The interface should use consistent spacing tokens for clean rhythm.

### Layout System
- Base spacing should use an 8px rhythm.
- Panels should have generous internal padding.
- Primary buttons should not sit too close to edge borders.
- Lists should separate rows enough for readable touch selection.

### Desktop Layout
- Use a centered content shell with flexible side panels.
- Main menu and lobby should use strong vertical hierarchy.
- Social systems can appear in secondary columns.

### Mobile Layout
- Stack content vertically.
- Reduce side panel density.
- Keep key actions within thumb reach.
- Make important lists scrollable but not cramped.

### General Spacing Rules
- Do not crowd labels and icons.
- Give modals enough margin from screen edges.
- Preserve consistent spacing between sections across screens.

---

## 7. Animation and Motion System
Motion should improve clarity, reinforce feedback, and bring the arcade presentation to life.

### Motion Principles
- Motion should be quick and purposeful.
- Transitions should feel snappy, not sluggish.
- Game-critical screens should avoid long animations.
- Small looping ambient motion is preferred over constant busy motion.

### Standard Motion Vocabulary
- **Fade and scale in** for modals and popups.
- **Slide and settle** for side panels.
- **Bounce micro-motion** for rewards and unlocks.
- **Pulse** for queueing and ready states.
- **Spark burst** for victories, pickups, and rewards.
- **Shimmer** for premium or highlighted cosmetics.

### Timing Guidelines
- Fast UI transitions: 120 to 180 ms.
- Modal entrance / exit: 180 to 240 ms.
- Reward reveal sequences: 300 to 500 ms.
- Non-critical ambient loops: slow and subtle.

### Motion Constraints
- Offer a reduced-motion option.
- Avoid excessive camera-like motion in menus.
- On mobile, keep transitions simpler to preserve performance and comfort.

---

## 8. Responsive Behavior
The UI must adapt gracefully to desktop, tablet, and mobile browsers.

### Breakpoint Behavior
- **Desktop**: full multi-column layouts, hover states, and sidebars.
- **Tablet**: reduced columns, larger touch targets, simplified density.
- **Mobile portrait**: single-column stacking, bottom-docked primary actions, collapsible panels.
- **Mobile landscape**: split layouts may return, but must remain thumb-friendly.

### Responsive Rules
- Primary action buttons should remain visible without excessive scrolling.
- Lists should convert into cards where necessary.
- Tooltips should become tap-to-open popovers on touch devices.
- Hover-only information must always have a tap equivalent.
- Text truncation should be avoided for important labels.

### Mobile-Specific Constraints
- Maintain adequate touch target sizes.
- Avoid dense hover menus.
- Keep modal height manageable.
- Ensure chat, friends, and lobby controls are reachable one-handed when possible.

---

## 9. Screen-by-Screen Specification

---

## 9.1 Splash Screen
### Purpose
Establish identity immediately and transition into loading.

### Layout
- Centered Pixel Panic logo.
- Animated pixel flare or arcade pulse behind logo.
- Small loading indicator near bottom.
- Optional publisher or studio mark before the logo appears.

### Buttons
- Typically no interactive buttons.
- On first launch, a subtle “tap to continue” can appear if legal or platform messaging is required.

### Animation
- Logo fades in with a slight pixel shimmer.
- Background particles drift slowly.
- Loading indicator pulses.

### Color Palette
- Mostly dark navy background.
- Cyan and coral accents.
- Occasional gold spark.

### Mobile Adaptation
- Keep logo centered and safely within notch boundaries.
- Avoid visual clutter so load state remains readable.

---

## 9.2 Loading Screen
### Purpose
Show loading progress and set expectations before menu or match entry.

### Layout
- Large centered logo or mascot silhouette.
- Loading bar with segmented pixel fill.
- Tip text below bar.
- Optional rotating gameplay tip card or seasonal art panel.

### Buttons
- None during initial load.
- If load takes longer, a reconnect or retry action may appear.

### Animation
- Loading bar fills in stepped segments.
- Background elements animate at low frequency.
- Tip card crossfades every few seconds.

### Popups
- Network error modal.
- Asset download retry popup.
- Server maintenance notice.

### Mobile Adaptation
- Keep text short.
- Maintain high contrast for progress bar.

---

## 9.3 Login
### Purpose
Allow returning players to authenticate quickly and safely.

### Layout
- Brand header.
- Email and password fields.
- Social login options if supported.
- Primary login button.
- Secondary actions for forgot password and register.

### Buttons
- Login.
- Continue with external provider.
- Forgot password.
- Register.
- Back.

### States
- Disabled button until required fields are valid.
- Inline validation for errors.
- Loading state on submit.
- Error toast or inline banner on failure.

### Animation
- Fields glow on focus.
- Error shake only when necessary and not excessive.
- Button presses use a tactile pop.

### Mobile Adaptation
- Stack form fields vertically.
- Keep keyboard-safe spacing.
- Use large touch targets.

---

## 9.4 Guest Login
### Purpose
Let players enter quickly without friction.

### Layout
- Simple explanation of guest mode.
- Primary button to continue as guest.
- Secondary button to register or sign in.
- Short note explaining guest limitations if applicable.

### Buttons
- Continue as Guest.
- Sign In.
- Create Account.

### UX Notes
Guest access should be low-friction and clearly upgradable later.

### Animation
- Fast transition into the main menu.
- Small confirmation pulse on selection.

### Mobile Adaptation
- This screen should be extremely lightweight and touch-first.

---

## 9.5 Register
### Purpose
Create a permanent account and preserve progression.

### Layout
- Username field.
- Email field.
- Password field.
- Confirm password.
- Terms and policy checkbox.
- Primary register button.

### Buttons
- Register.
- Back to Login.
- Generate suggested name if available.

### Validation
- Username availability.
- Password strength.
- Email format.
- Terms acceptance.

### Animation
- Success state should feel celebratory but restrained.

### Mobile Adaptation
- Use native keyboard types where helpful.
- Keep validation messages concise.

---

## 9.6 Main Menu
### Purpose
Serve as the central hub for play, social, progression, and monetization.

### Layout
Desktop main menu should typically include:
- Prominent Play button.
- Player profile card.
- Friends or party panel.
- Featured seasonal content panel.
- Side navigation for progression, cosmetics, leaderboard, settings, and shop if present.

Mobile main menu should prioritize:
- Play button.
- Bottom navigation or compact tab bar.
- Collapsible social panel.
- Featured reward or event banner.

### Buttons
- Play.
- Ranked.
- Custom Room.
- Profile.
- Inventory.
- Friends.
- Leaderboard.
- Settings.
- Daily Rewards.
- Achievements.
- Statistics.

### Animation
- Background scene loops subtly.
- Featured card carousel rotates slowly.
- Notification badges pulse gently.

### Popups
- News or seasonal update modal.
- Reward claim popup.
- Account sync popup.

### Mobile Adaptation
- Keep Play as the dominant action.
- Use tab bar or bottom sheet navigation.
- Reduce visual density and use cards rather than columns.

---

## 9.7 Profile
### Purpose
Show player identity, rank, rewards, and identity customization.

### Layout
- Large avatar or character portrait.
- Nameplate and titles.
- Rank badge.
- Progress summary.
- Tabs for stats, cosmetics, achievements, and history.

### Buttons
- Edit profile.
- Change banner.
- Equip title.
- Set favorite character.
- View stats.
- Share profile.

### Animation
- Rank badge shimmer.
- Banner transitions when changed.
- Hover or tap reveals stat tooltips.

### Mobile Adaptation
- Use collapsible tab sections.
- Keep profile summary pinned near top.

---

## 9.8 Inventory
### Purpose
Manage owned items and equip cosmetics.

### Layout
- Category tabs: skins, emotes, banners, trails, nameplates, etc.
- Grid of owned items.
- Preview panel.
- Equip/unequip actions.
- Filter and sort controls.

### Buttons
- Equip.
- Unequip.
- Preview.
- Favorite.
- Filter.
- Sort.
- Search.

### Animation
- Item card shimmer on hover or selection.
- Preview character rotates or idles with equipped item.
- Unlocks animate with reveal burst.

### Popups
- Item detail popup.
- Unlock confirmation modal.
- Bundle preview modal.

### Mobile Adaptation
- Use a two-step selection flow: category first, item list second.
- Keep preview area collapsible but easily accessible.

---

## 9.9 Lobby
### Purpose
Prepare a match, manage party state, and inspect readiness.

### Layout
- Center or left focus: chosen mode and map information.
- Party roster panel.
- Ready states.
- Social invite shortcuts.
- Match settings or loadout preview if allowed.

### Buttons
- Ready / Unready.
- Invite Friends.
- Change Mode.
- Open Room Browser.
- Create Private Room.
- Switch Character.
- Leave Party.

### Animation
- Ready state indicator pulses.
- Party join/leave uses quick card slide.
- Match banner updates with motion only when settings change.

### Mobile Adaptation
- Use stacked party cards.
- Keep ready button fixed near bottom.
- Move secondary actions into a small menu or bottom sheet.

---

## 9.10 Friends
### Purpose
Support friend management, social presence, and quick invites.

### Layout
- Search bar.
- Tabs for friends, requests, recent players, blocked.
- Friend list cards with presence indicators.
- Quick action row for invite, message, spectate, and profile.

### Buttons
- Add Friend.
- Invite.
- Message.
- Join.
- Spectate.
- Remove.
- Block.
- Mute.

### States
- Online.
- In queue.
- In match.
- In lobby.
- Away.

### Animation
- Presence dots pulse subtly.
- Invite confirmation toast slides in.

### Mobile Adaptation
- Use full-width list items.
- Keep quick actions in swipe or long-press menus when space is limited.

---

## 9.11 Leaderboard
### Purpose
Show ranked standing, competitive goals, and social comparison.

### Layout
- Leaderboard header with season context.
- Filters for global, regional, friends, mode, and season.
- Ranked rows with avatar, name, rank, score, and trend indicator.
- Player’s current row highlighted.

### Buttons
- Global.
- Regional.
- Friends.
- Season.
- Mode filter.
- Profile open.

### Animation
- Rank changes animate with upward or downward motion.
- Current player row softly glows.

### Mobile Adaptation
- Keep filters collapsible.
- Use compact stacked rows with key stats first.

---

## 9.12 Matchmaking
### Purpose
Communicate queue state and allow mode or party changes before a match begins.

### Layout
- Big queue status panel.
- Estimated wait time.
- Selected mode and region.
- Ready party members.
- Cancel button.
- Optional map or mode teaser art.

### Buttons
- Cancel Queue.
- Change Mode.
- Invite.
- Party Settings.
- Open Chat.

### Animation
- Queue pulse ring.
- Search status dots animate.
- Estimated time updates softly, not aggressively.

### Popups
- Match found modal.
- Accept match confirmation.
- Queue abandoned warning.

### Mobile Adaptation
- Keep cancel button always visible.
- Use concise queue state.

---

## 9.13 Room Browser
### Purpose
Allow players to browse public and private rooms.

### Layout
- Search and filters.
- Room list with mode, player count, region, ping, and privacy state.
- Detail preview when a room is selected.

### Buttons
- Join.
- Refresh.
- Filter.
- Search.
- Favorite room if supported.

### Animation
- Room cards slide in on refresh.
- Occupancy bars animate smoothly.

### Mobile Adaptation
- Use compact room cards with bottom action bar.
- Keep room detail in a collapsible panel.

---

## 9.14 Create Room
### Purpose
Let players host a private session.

### Layout
- Mode selector.
- Map selector.
- Match length or round settings.
- Privacy settings.
- Password field if enabled.
- Invite options.

### Buttons
- Create Room.
- Copy Invite Link.
- Generate Code.
- Advanced Settings.
- Cancel.

### Animation
- Settings changes update preview panels instantly.
- Room code reveal uses a subtle pop.

### Mobile Adaptation
- Use form sections that can collapse.
- Keep create action fixed at bottom.

---

## 9.15 Settings
### Purpose
Let players tune controls, visuals, audio, accessibility, and social privacy.

### Layout
- Category list or tabs.
- Detailed setting panel.
- Live preview for visual options where appropriate.

### Settings Categories
- Graphics.
- Audio.
- Controls.
- Gameplay.
- Accessibility.
- Chat.
- Privacy.
- Notifications.
- Language.
- Account.

### Buttons
- Save.
- Reset to Default.
- Back.
- Test Input.
- Calibrate.

### Animation
- Toggle switches snap with tactile motion.
- Sliders have smooth fill transitions.

### Mobile Adaptation
- Prefer single-column settings with section dividers.
- Keep advanced options tucked behind expandable groups.

---

## 9.16 Pause Menu
### Purpose
Provide in-match access to settings, social actions, and exit controls.

### Layout
- Semi-transparent overlay.
- Central modal or side panel.
- Match status summary.
- Resume button as primary action.

### Buttons
- Resume.
- Settings.
- Controls.
- Leave Match.
- Report Player.
- Mute Chat.
- Spectator controls if relevant.

### Animation
- Pause menu should freeze gameplay immediately.
- Overlay fades in quickly.

### Mobile Adaptation
- Use large stacked buttons.
- Keep resume at top or bottom depending on device orientation.

---

## 9.17 Victory Screen
### Purpose
Celebrate success and reinforce reward progression.

### Layout
- Large victory banner.
- Player placement or win state.
- Highlighted stats.
- XP and coin rewards.
- Rank progress.
- Mission progress.
- Rematch and queue actions.

### Buttons
- Rematch.
- Queue Again.
- Return to Lobby.
- Share.
- Claim Rewards.

### Animation
- Victory burst.
- Confetti or pixel spark shower.
- Stats count up.
- Reward cards flip or slide in.

### Mobile Adaptation
- Keep reward summary short.
- Allow swipe-through or stacked reward cards.

---

## 9.18 Defeat Screen
### Purpose
Provide closure, preserve motivation, and avoid frustration.

### Layout
- Defeat banner or placement summary.
- Personal stats.
- Reward summary.
- Next-step actions.
- Optional tip or encouragement card.

### Buttons
- Rematch.
- Queue Again.
- Return to Lobby.
- View Stats.
- Share.

### Animation
- Loss state should be calmer than victory.
- Avoid harsh red flashing or punitive motion.
- Count-up rewards should still feel worthwhile.

### Mobile Adaptation
- Keep layout friendly and compact.
- Make queue actions reachable immediately.

---

## 9.19 Daily Rewards
### Purpose
Encourage return visits with a lightweight reward loop.

### Layout
- Calendar or streak board.
- Current day highlight.
- Claimed and upcoming rewards.
- Claim button.

### Buttons
- Claim.
- Skip / Close.
- View Schedule.

### Animation
- Reward card pops with sparkle.
- Claimed state flips to a stamped visual.

### Popups
- Streak milestone popup.
- Missed-day recovery option if supported.

### Mobile Adaptation
- Use a vertical reward stack rather than a wide calendar if needed.

---

## 9.20 Achievements
### Purpose
Show progress goals and celebrate completion.

### Layout
- Achievement category tabs.
- Progress list with icons and partial completion bars.
- Featured achievement panel.
- Reward summary for completed items.

### Buttons
- Track.
- View details.
- Claim reward.
- Filter categories.

### Animation
- Completion unlock uses strong sparkle and badge reveal.
- Progress bars animate smoothly.

### Mobile Adaptation
- Use short achievement rows with detail expansion.

---

## 9.21 Statistics
### Purpose
Provide player performance visibility and long-term self-improvement context.

### Layout
- Top summary cards.
- Graphs or trend lines.
- Mode breakdown.
- Character performance.
- Session history.

### Buttons
- Time range filters.
- Mode filters.
- Character filters.
- Export or share if supported.

### Animation
- Graphs animate in on load.
- Highlighted data points glow on interaction.

### Mobile Adaptation
- Use stacked cards instead of complex dashboards.
- Favor simple trend summaries over dense charts.

---

## 10. Interaction Patterns
### Buttons
Primary buttons should be large, bright, and clearly differentiated from secondary or tertiary actions.

#### Primary Button Style
- Strong fill color.
- Slight glow or gradient.
- Pressed state compresses subtly.
- Disabled state is visibly muted.

#### Secondary Button Style
- Outlined or lower-contrast filled button.
- Used for back, cancel, or optional actions.

#### Tertiary Button Style
- Text-based or minimal icon button.
- Used for utility or low-priority actions.

### Popups and Modals
- Use modals for confirmations, rewards, and important system messages.
- Use toast notifications for lightweight feedback.
- Avoid stacking too many modals.
- Always provide a clear close or confirm path.

### Hover and Focus States
- Desktop hover should use glow, lift, or border brighten.
- Keyboard focus should be highly visible and accessible.
- Mobile tap states should mimic hover feedback through press animation.

### Tooltips
- Tooltips should explain stats, currencies, and item effects clearly.
- On mobile, tooltips should open as tap popovers or bottom sheets.

---

## 11. Transition System
Screen transitions should feel smooth and efficient.

### Transition Rules
- Major navigation uses fade and slide combinations.
- Modal open/close should be fast and not over-animated.
- Match entry and results screens may use more dramatic transitions, but only once per match.
- Frequent screens should not have heavy motion overhead.

### Transition Hierarchy
- Navigation: subtle.
- Rewards: celebratory.
- Match state: quick and functional.
- Errors: clear and immediate.

---

## 12. Popup Catalog
The UI should use a predictable popup system.

### System Popups
- Login error.
- Network error.
- Maintenance notice.
- Account verification notice.
- Update required notice.
- Match found.
- Reward unlocked.
- Item purchased.
- Settings reset confirmation.
- Leave match confirmation.
- Report submission confirmation.

### Popup Rules
- Use the smallest necessary modal for the task.
- Favor inline errors when the fix is immediate.
- Avoid interrupting players with non-critical popups during queue or match.

---

## 13. Mobile Adaptation Summary
Pixel Panic must feel native on mobile browsers, not like a cramped desktop port.

### Mobile Design Requirements
- Fixed bottom navigation where useful.
- Large tap targets.
- Reduced information density.
- Bottom sheets for secondary actions.
- Responsive overlays for chat, friends, and inventory.
- Safe-area support for notches and gesture bars.
- Portrait-first compatibility with landscape enhancements.

### Mobile UX Priorities
- Play quickly.
- Queue quickly.
- Invite friends quickly.
- Adjust settings quickly.
- Read reward and progression screens quickly.

### Mobile Interaction Notes
- Avoid hover-dependent design.
- Keep list item actions simple.
- Use long-press sparingly.
- Ensure keyboard overlays do not hide critical controls.

---

## 14. Accessibility in UI/UX
Accessibility must be visible in the interface itself, not hidden in settings.

### UI Accessibility Features
- High contrast mode.
- Text scaling.
- Colorblind-safe states.
- Motion reduction.
- Screen-reader-friendly labels.
- Focus visibility.
- Simplified chat mode.
- Large UI mode for mobile or accessibility preference.

### Design Rules
- Never rely on color alone.
- Avoid flashing danger states.
- Keep text readable against all surfaces.
- Ensure all critical actions are reachable without precision pointer use.

---

## 15. Screen Flow Overview
### Primary Player Flow
1. Splash.
2. Loading.
3. Login or Guest Login.
4. Main Menu.
5. Lobby.
6. Matchmaking.
7. Match.
8. Victory or Defeat.
9. Rewards and progression screens.

### Secondary Flow Paths
- Main Menu to Profile, Inventory, Leaderboard, Friends, Statistics, Achievements, Settings.
- Main Menu to Room Browser or Create Room.
- Pause Menu back to Settings or leave flow.

### Flow Rule
Any common destination should be reachable in one or two interactions from the main menu.

---

## 16. Final UX Tone
The interface should feel energetic, readable, and inviting. It should evoke classic arcade charm through motion, color, and shape, but it should never sacrifice modern usability.

The player should feel that Pixel Panic is fast to learn, easy to navigate, and satisfying to return to every session.
