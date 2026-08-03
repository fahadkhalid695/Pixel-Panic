# Pixel Panic Database Design

## Purpose
This document defines the PostgreSQL relational database design for Pixel Panic. It covers the complete table set, relationships, primary keys, foreign keys, indexing strategy, security considerations, and scalability considerations.

The design is intended for a competitive online multiplayer browser game with progression, cosmetics, ranked play, social systems, chat, seasonal content, and live service operations. The schema prioritizes integrity, fast reads for player-facing screens, safe writes for authoritative server results, and straightforward scale-out paths.

No SQL code is included in this document.

---

## 1. Database Design Principles
### 1.1 Core Goals
- Preserve authoritative player data in PostgreSQL.
- Keep profile, progression, social, and economy data consistent.
- Support fast reads for login, menu, lobby, and post-match screens.
- Make match results append-only and auditable.
- Separate current state from historical records where needed.
- Support seasonal resets without losing history.
- Avoid pay-to-win structures by keeping cosmetics and rewards separate from gameplay logic.

### 1.2 Data Modeling Principles
- Use stable surrogate primary keys for most tables.
- Use foreign keys for ownership and referential integrity.
- Store immutable history in append-style tables when possible.
- Keep frequently queried player state denormalized only where it significantly improves reads.
- Use soft deletion selectively for moderation, social relations, and audit-sensitive data.
- Prefer explicit timestamps and season identifiers for live-service data.

### 1.3 Scope of This Design
This document covers the following core tables:
- Users
- Accounts
- Profiles
- Statistics
- Matches
- Player Match History
- Inventory
- Cosmetics
- Achievements
- Friends
- Friend Requests
- Leaderboards
- Ranks
- Daily Missions
- Weekly Missions
- Rooms
- Chat Messages
- Season Rewards
- Settings
- Notifications

Where a table benefits from auxiliary lookup or history tables, those are described as implementation notes in the relevant section.

---

## 2. High-Level Relationship Model
### 2.1 Core Ownership Chain
- One **User** owns one or more **Accounts**.
- One **User** owns one **Profile**.
- One **User** owns many **Statistics** records, usually partitioned by season or mode.
- One **User** owns many **Inventory** entries.
- One **User** owns many **Achievements** progress rows.
- One **User** owns many **Daily Missions** and **Weekly Missions** progress rows.
- One **User** owns many **Notifications**.
- One **User** participates in many **Matches** through **Player Match History**.
- One **User** participates in many **Rooms** and **Chat Messages**.
- One **User** can have many **Friends** and **Friend Requests** relationships.

### 2.2 Content and Reference Chains
- **Cosmetics** define the catalog of equippable or purchasable items.
- **Season Rewards** define season-specific reward tracks and grants.
- **Leaderboards** and **Ranks** define competitive structure and progression.
- **Matches** define the authoritative match instance.
- **Player Match History** captures player-level participation and outcomes.
- **Rooms** define public, private, or practice lobbies.
- **Chat Messages** reference room, party, lobby, or direct channels.

### 2.3 Relationship Philosophy
The schema should clearly separate:
- Identity and authentication.
- Presentation and profile data.
- Competitive and match data.
- Cosmetic and inventory ownership.
- Social relationships.
- Mission and progression state.
- Messaging and notifications.

This keeps each part of the game easier to scale, secure, and evolve independently.

---

## 3. Table-by-Table Design

---

## 3.1 Users
### Purpose
The Users table is the canonical identity record for each player. It represents the human player or game identity, independent of login method.

### Primary Key
- `user_id` UUID or bigint surrogate key.

### Key Columns
- `user_id`
- `created_at`
- `updated_at`
- `status` such as active, suspended, banned, deleted
- `display_name_policy_state` if moderation workflows require it
- `last_login_at`
- `locale`
- `region_preference`
- `is_guest` if guest sessions are supported

### Foreign Keys
- None as the root identity table.

### Relationships
- One-to-one with Profiles.
- One-to-many with Accounts.
- One-to-many with Statistics, Inventory, Achievements, Missions, Notifications, and match history.

### Indexes
- Unique index on `user_id`.
- Index on `status` for moderation or admin filtering.
- Index on `created_at` for operational queries.

### Design Notes
This table should remain relatively small and stable. Avoid storing volatile gameplay data here. It should be optimized for identity lookup, moderation, and account state transitions.

---

## 3.2 Accounts
### Purpose
The Accounts table stores authentication-related records and login-provider mappings for a user.

### Primary Key
- `account_id` UUID or bigint surrogate key.

### Key Columns
- `account_id`
- `user_id`
- `provider_type` such as email, Google, Apple, guest, or other external provider
- `provider_subject` or provider identity string
- `email` if applicable
- `password_hash` if applicable
- `email_verified_at`
- `created_at`
- `last_auth_at`
- `auth_status`
- `mfa_enabled` if supported
- `refresh_token_version` or equivalent revocation marker

### Foreign Keys
- `user_id` references Users.

### Relationships
- Many accounts can map to one user if provider linking is supported.
- One account record is the authoritative login credential source.

### Indexes
- Unique index on `(provider_type, provider_subject)`.
- Unique index on `email` when present and required to be unique.
- Index on `user_id`.
- Index on `auth_status` for security/admin review.

### Design Notes
Keep authentication secrets limited to this table or a dedicated auth extension table if operationally preferred. Account data should be protected more strictly than profile or gameplay data.

---

## 3.3 Profiles
### Purpose
The Profiles table stores public-facing identity, cosmetics presentation, and player personalization fields.

### Primary Key
- `profile_id` UUID or bigint surrogate key.

### Key Columns
- `profile_id`
- `user_id`
- `display_name`
- `avatar_cosmetic_id` if avatars are cosmetic-driven
- `banner_cosmetic_id`
- `title_id`
- `favorite_character_id`
- `bio` if supported
- `profile_visibility`
- `created_at`
- `updated_at`

### Foreign Keys
- `user_id` references Users.
- Cosmetic-related references may point to Cosmetics.

### Relationships
- One-to-one with Users.
- References the cosmetics catalog for selected presentation items.

### Indexes
- Unique index on `user_id`.
- Unique index on `display_name` if display names are global and must be unique.
- Index on `favorite_character_id` if used in discovery or analytics.

### Design Notes
This table should be optimized for fast profile rendering and social lookup. Sensitive fields should not be stored here.

---

## 3.4 Statistics
### Purpose
Statistics stores player performance aggregates used for profile summaries, analytics, and competitive progress.

### Primary Key
- `statistics_id` UUID or bigint surrogate key.

### Key Columns
- `statistics_id`
- `user_id`
- `season_id` if seasonal aggregation is used
- `mode_id` if mode-specific tracking is required
- `matches_played`
- `wins`
- `losses`
- `eliminations`
- `deaths`
- `assists`
- `objective_score`
- `damage_dealt`
- `damage_taken`
- `powerups_collected`
- `time_played_seconds`
- `disconnects`
- `created_at`
- `updated_at`

### Foreign Keys
- `user_id` references Users.
- `season_id` may reference a seasons table if added later.

### Relationships
- One user can have many statistics rows by season, mode, or lifetime rollup.

### Indexes
- Unique or composite index on `(user_id, season_id, mode_id)` depending on granularity.
- Index on `season_id`.
- Index on `mode_id`.

### Design Notes
If lifetime and seasonal stats are both needed, keep a lifetime row and seasonal rows separate to avoid expensive recalculation. Do not use this table as an event log.

---

## 3.5 Matches
### Purpose
Matches stores authoritative match metadata and final outcomes for each completed game session.

### Primary Key
- `match_id` UUID or bigint surrogate key.

### Key Columns
- `match_id`
- `room_id`
- `mode_id`
- `region`
- `map_id`
- `season_id`
- `started_at`
- `ended_at`
- `status` such as pending, active, completed, aborted
- `winner_type` such as solo, team, objective, or placement-based
- `server_instance_id`
- `match_seed` if deterministic replay support is planned
- `created_at`

### Foreign Keys
- `room_id` references Rooms.
- `mode_id` may reference a mode lookup table if implemented.
- `season_id` may reference a season lookup table if implemented.

### Relationships
- One match has many Player Match History rows.
- One match can produce many notifications, ranked changes, and mission progress updates.

### Indexes
- Index on `room_id`.
- Index on `started_at` and `ended_at`.
- Index on `(mode_id, started_at)` for reporting.
- Index on `(season_id, ended_at)` for seasonal analytics.

### Design Notes
Matches should be authoritative and mostly append-only. Updates should be limited to state transitions and finalization.

---

## 3.6 Player Match History
### Purpose
Player Match History is the per-user per-match fact table that records an individual player’s participation and performance.

### Primary Key
- `player_match_history_id` UUID or bigint surrogate key.

### Key Columns
- `player_match_history_id`
- `match_id`
- `user_id`
- `team_id` if teams exist
- `placement`
- `result` such as win, loss, draw, abandoned
- `score`
- `eliminations`
- `assists`
- `deaths`
- `objective_score`
- `damage_dealt`
- `damage_taken`
- `time_survived_seconds`
- `disconnect_reason`
- `earned_xp`
- `earned_coins`
- `rank_delta`
- `created_at`

### Foreign Keys
- `match_id` references Matches.
- `user_id` references Users.

### Relationships
- Many rows belong to one match.
- Many rows belong to one user across match history.

### Indexes
- Unique index on `(match_id, user_id)`.
- Index on `user_id` for history lookup.
- Index on `match_id` for match detail views.
- Index on `(user_id, created_at desc)` for recent activity.

### Design Notes
This is one of the most important tables in the system. It should support both post-match UI and analytics. It should be immutable after finalization except for moderation corrections.

---

## 3.7 Inventory
### Purpose
Inventory stores player-owned items, unlock state, and cosmetic entitlements.

### Primary Key
- `inventory_id` UUID or bigint surrogate key.

### Key Columns
- `inventory_id`
- `user_id`
- `cosmetic_id`
- `source_type` such as shop, mission, season reward, achievement, grant
- `quantity` if stackable items exist
- `equipped_slot` if the item can be equipped directly
- `unlocked_at`
- `expires_at` for temporary items if ever used
- `is_owned`
- `is_favorite`

### Foreign Keys
- `user_id` references Users.
- `cosmetic_id` references Cosmetics.

### Relationships
- One user has many inventory rows.
- One cosmetic can appear in many users’ inventories.

### Indexes
- Unique index on `(user_id, cosmetic_id)` for permanent ownership.
- Index on `user_id`.
- Index on `cosmetic_id`.
- Index on `is_owned` if active ownership queries are common.

### Design Notes
Inventory should reflect ownership, not only equip state. Equipped state can be stored here or in Settings depending on whether equipment is treated as loadout preference or inventory metadata. For clarity, the preferred design is to store equipped selections in Settings or a dedicated loadout structure if added later.

---

## 3.8 Cosmetics
### Purpose
Cosmetics is the item catalog for all visual-only rewards and purchases.

### Primary Key
- `cosmetic_id` UUID or bigint surrogate key.

### Key Columns
- `cosmetic_id`
- `cosmetic_type` such as skin, emote, banner, trail, title, nameplate
- `name`
- `rarity`
- `season_id` if time-bound
- `is_store_item`
- `is_seasonal`
- `is_limited`
- `unlock_method`
- `visual_asset_key`
- `preview_asset_key`
- `created_at`
- `updated_at`

### Foreign Keys
- `season_id` may reference a season table if implemented.

### Relationships
- Referenced by Inventory, Profiles, Season Rewards, and possibly Achievements.

### Indexes
- Unique index on `name` if naming is global.
- Index on `(cosmetic_type, rarity)`.
- Index on `season_id`.
- Index on `is_store_item`.

### Design Notes
This table is catalog data and should be read frequently. It should be cache-friendly and stable, with minimal writes after content release.

---

## 3.9 Achievements
### Purpose
Achievements stores achievement definitions and player completion progress.

### Primary Key
- `achievement_id` UUID or bigint surrogate key.

### Key Columns
- `achievement_id`
- `user_id`
- `achievement_key`
- `progress_current`
- `progress_required`
- `completed_at`
- `reward_claimed_at`
- `season_id` if seasonal achievements exist
- `is_hidden`

### Foreign Keys
- `user_id` references Users.
- `achievement_key` may reference an achievement definition table if separated.

### Relationships
- One user can have many achievement progress rows.

### Indexes
- Unique index on `(user_id, achievement_key)`.
- Index on `user_id`.
- Index on `completed_at`.

### Design Notes
If achievement definitions are separated from progress, the definition catalog can live in a companion lookup table. The user-facing progress record should remain very fast to query.

---

## 3.10 Friends
### Purpose
Friends stores accepted social relationships between users.

### Primary Key
- `friendship_id` UUID or bigint surrogate key.

### Key Columns
- `friendship_id`
- `user_id`
- `friend_user_id`
- `created_at`
- `last_interaction_at`
- `relationship_status`
- `note` if personal labels are supported

### Foreign Keys
- `user_id` references Users.
- `friend_user_id` references Users.

### Relationships
- Represents an accepted mutual relationship.
- Usually there should be a mirrored or normalized symmetric relationship strategy.

### Indexes
- Unique index on normalized pair `(least(user_id, friend_user_id), greatest(user_id, friend_user_id))` or equivalent application-enforced uniqueness.
- Index on `user_id`.
- Index on `friend_user_id`.

### Design Notes
The schema should prevent duplicate bilateral friend records. Use either a canonical ordering strategy or a separate canonical relationship key.

---

## 3.11 Friend Requests
### Purpose
Friend Requests stores pending and historical friendship invitations.

### Primary Key
- `friend_request_id` UUID or bigint surrogate key.

### Key Columns
- `friend_request_id`
- `sender_user_id`
- `receiver_user_id`
- `status` such as pending, accepted, rejected, canceled, expired
- `message`
- `sent_at`
- `responded_at`
- `expires_at`

### Foreign Keys
- `sender_user_id` references Users.
- `receiver_user_id` references Users.

### Relationships
- A request can become a friendship record in Friends once accepted.

### Indexes
- Unique index on `(sender_user_id, receiver_user_id, status)` for active requests.
- Index on `receiver_user_id`.
- Index on `sender_user_id`.
- Index on `status`.

### Design Notes
Requests should be idempotent and easy to expire. Active requests should be limited to prevent spam.

---

## 3.12 Leaderboards
### Purpose
Leaderboards stores ranked ladder snapshots and board entries for fast display.

### Primary Key
- `leaderboard_entry_id` UUID or bigint surrogate key.

### Key Columns
- `leaderboard_entry_id`
- `leaderboard_type`
- `season_id`
- `region`
- `user_id`
- `rank_position`
- `score`
- `tier`
- `division`
- `wins`
- `losses`
- `updated_at`
- `snapshot_at`

### Foreign Keys
- `user_id` references Users.
- `season_id` may reference a season table if implemented.

### Relationships
- One user can appear in many leaderboard contexts across seasons, regions, and modes.

### Indexes
- Unique index on `(leaderboard_type, season_id, region, user_id)`.
- Unique index on `(leaderboard_type, season_id, region, rank_position)` if stored physically.
- Index on `(leaderboard_type, season_id, region, score desc)`.
- Index on `user_id`.

### Design Notes
For scale, leaderboards are often materialized snapshots rather than fully live-ranked tables. Store ranking data in a form that supports both public display and periodic recalculation.

---

## 3.13 Ranks
### Purpose
Ranks stores competitive rank definitions and the player’s current or historical rank state.

### Primary Key
- `rank_id` UUID or bigint surrogate key.

### Key Columns
- `rank_id`
- `user_id`
- `season_id`
- `rank_tier`
- `rank_division`
- `rating_mmr`
- `rating_visible`
- `promotion_progress`
- `demotion_progress`
- `placement_completed_at`
- `updated_at`

### Foreign Keys
- `user_id` references Users.
- `season_id` may reference a season table if implemented.

### Relationships
- One user has one current rank record per competitive season or queue.

### Indexes
- Unique index on `(user_id, season_id)`.
- Index on `(season_id, rank_tier, rating_visible)`.
- Index on `user_id`.

### Design Notes
If multiple modes have separate ranks, include `queue_type` or `mode_id` in the unique key. Keep rank history separate if detailed historical tracking is needed.

---

## 3.14 Daily Missions
### Purpose
Daily Missions stores daily mission definitions and player progress against the active daily mission set.

### Primary Key
- `daily_mission_id` UUID or bigint surrogate key.

### Key Columns
- `daily_mission_id`
- `user_id`
- `mission_key`
- `mission_date`
- `progress_current`
- `progress_required`
- `is_completed`
- `reward_claimed_at`
- `created_at`
- `updated_at`

### Foreign Keys
- `user_id` references Users.

### Relationships
- One user can have multiple daily mission rows per day.

### Indexes
- Unique index on `(user_id, mission_key, mission_date)`.
- Index on `(user_id, mission_date)`.
- Index on `is_completed`.

### Design Notes
Daily mission state should rotate cleanly without requiring expensive historical rewrites. A date key is essential for query simplicity and reset logic.

---

## 3.15 Weekly Missions
### Purpose
Weekly Missions stores weekly mission progress and claims.

### Primary Key
- `weekly_mission_id` UUID or bigint surrogate key.

### Key Columns
- `weekly_mission_id`
- `user_id`
- `mission_key`
- `week_start_date`
- `progress_current`
- `progress_required`
- `is_completed`
- `reward_claimed_at`
- `created_at`
- `updated_at`

### Foreign Keys
- `user_id` references Users.

### Relationships
- One user can have multiple weekly mission rows per week.

### Indexes
- Unique index on `(user_id, mission_key, week_start_date)`.
- Index on `(user_id, week_start_date)`.
- Index on `is_completed`.

### Design Notes
Weekly missions should mirror the daily mission pattern, but with a weekly reset key rather than a calendar date.

---

## 3.16 Rooms
### Purpose
Rooms stores live lobby and match room metadata for public, private, and practice sessions.

### Primary Key
- `room_id` UUID or bigint surrogate key.

### Key Columns
- `room_id`
- `room_code`
- `room_type` such as public, private, practice, spectator
- `owner_user_id`
- `match_id` if the room has an active match
- `mode_id`
- `region`
- `status` such as open, filling, in_progress, closed
- `password_hash` if protected
- `max_players`
- `created_at`
- `updated_at`
- `expires_at`

### Foreign Keys
- `owner_user_id` references Users.
- `match_id` references Matches.

### Relationships
- A room may exist before a match starts.
- A room may map to a single active match or a reserved session.

### Indexes
- Unique index on `room_code`.
- Index on `owner_user_id`.
- Index on `(room_type, region, status)`.
- Index on `expires_at` for cleanup jobs.

### Design Notes
Rooms are ephemeral and should be easy to clean up. Use expiration logic aggressively to prevent orphaned private rooms.

---

## 3.17 Chat Messages
### Purpose
Chat Messages stores real-time and persisted social messaging across party, lobby, room, match, and direct channels.

### Primary Key
- `chat_message_id` UUID or bigint surrogate key.

### Key Columns
- `chat_message_id`
- `channel_type`
- `channel_id`
- `sender_user_id`
- `message_type` such as text, system, emote
- `content`
- `sent_at`
- `moderation_status`
- `deleted_at`
- `reported_count`

### Foreign Keys
- `sender_user_id` references Users.
- `channel_id` may reference a room, party, or direct channel depending on the channel type.

### Relationships
- Many messages belong to one room or channel.
- Many messages belong to one sender.

### Indexes
- Index on `(channel_type, channel_id, sent_at desc)`.
- Index on `sender_user_id`.
- Index on `moderation_status`.
- Partial index on active, non-deleted messages if supported.

### Design Notes
If direct messages are supported, consider a separate direct conversation table. For launch simplicity, `channel_type` plus `channel_id` can be sufficient.

---

## 3.18 Season Rewards
### Purpose
Season Rewards stores seasonal reward track definitions and player claim status.

### Primary Key
- `season_reward_id` UUID or bigint surrogate key.

### Key Columns
- `season_reward_id`
- `user_id`
- `season_id`
- `reward_tier`
- `reward_type`
- `reward_reference_id` such as cosmetic or currency package
- `claimed_at`
- `progress_current`
- `progress_required`
- `is_premium_track`

### Foreign Keys
- `user_id` references Users.
- `reward_reference_id` may point to Cosmetics or another reward catalog if generalized.

### Relationships
- One user can have many season reward rows per season.

### Indexes
- Unique index on `(user_id, season_id, reward_tier, is_premium_track)`.
- Index on `(user_id, season_id)`.
- Index on `claimed_at`.

### Design Notes
This table should support both season pass track progress and claim history. If the live-ops model expands, separate reward definitions and user claims can be introduced later.

---

## 3.19 Settings
### Purpose
Settings stores user preferences for gameplay, UI, audio, accessibility, chat, privacy, and notification behavior.

### Primary Key
- `settings_id` UUID or bigint surrogate key.

### Key Columns
- `settings_id`
- `user_id`
- `setting_key`
- `setting_value`
- `scope` such as account, device, or client
- `updated_at`

### Foreign Keys
- `user_id` references Users.

### Relationships
- One user can have many settings rows.

### Indexes
- Unique index on `(user_id, setting_key, scope)`.
- Index on `user_id`.
- Index on `setting_key` if common system queries are expected.

### Design Notes
A key-value model is the most flexible for settings because preferences evolve over time. Highly structured settings can still be cached or projected into client DTOs.

---

## 3.20 Notifications
### Purpose
Notifications stores user-facing alerts for rewards, social events, mission updates, matchmaking events, and moderation notices.

### Primary Key
- `notification_id` UUID or bigint surrogate key.

### Key Columns
- `notification_id`
- `user_id`
- `notification_type`
- `title`
- `body`
- `payload_json`
- `is_read`
- `priority`
- `created_at`
- `read_at`
- `expires_at`

### Foreign Keys
- `user_id` references Users.

### Relationships
- One user can have many notifications.
- Notifications can be linked to matches, missions, rewards, or social events through payload references.

### Indexes
- Index on `(user_id, is_read, created_at desc)`.
- Index on `user_id`.
- Index on `expires_at`.
- Index on `notification_type`.

### Design Notes
Notifications should be short-lived where possible. Old notifications can be archived or purged according to retention policy.

---

## 4. Relationship Summary
### 4.1 One-to-One Relationships
- Users to Profiles
- Users to primary Settings projections if a flattened representation is used

### 4.2 One-to-Many Relationships
- Users to Accounts
- Users to Statistics
- Users to Inventory
- Users to Achievements
- Users to Daily Missions
- Users to Weekly Missions
- Users to Notifications
- Users to Match History
- Users to Chat Messages
- Users to Friend Requests sent
- Users to Friend Requests received
- Users to Ranks
- Users to Season Rewards

### 4.3 Many-to-Many Relationships
These are represented through join or relationship tables rather than direct many-to-many primitives:
- Users to Friends
- Users to Matches through Player Match History
- Users to Rooms through membership or participant tracking if implemented separately
- Users to Cosmetics through Inventory

---

## 5. Indexing Strategy
### 5.1 General Indexing Rules
- Index every foreign key column used in joins.
- Index every frequent lookup column used in login, lobby, social, and post-match flows.
- Use composite indexes for common filter combinations.
- Avoid unnecessary indexes on write-heavy tables that do not benefit from them.

### 5.2 High-Value Query Paths
The most common reads in Pixel Panic will be:
- Login and account resolution.
- Profile lookup.
- Friend and presence lists.
- Inventory and cosmetics loadout retrieval.
- Match history and post-match result screens.
- Rank and leaderboard queries.
- Active missions and reward progress.
- Notifications and unread counts.

### 5.3 Suggested Critical Indexes
- Users: `status`, `created_at`
- Accounts: `provider_type + provider_subject`, `email`, `user_id`
- Profiles: `display_name`, `user_id`
- Statistics: `user_id + season_id + mode_id`
- Matches: `started_at`, `ended_at`, `mode_id + season_id`
- Player Match History: `user_id + created_at`, `match_id + user_id`
- Inventory: `user_id + cosmetic_id`
- Cosmetics: `cosmetic_type + rarity`, `season_id`
- Achievements: `user_id + achievement_key`
- Friends: canonical pair index, `user_id`
- Friend Requests: `receiver_user_id`, `status`
- Leaderboards: `leaderboard_type + season_id + region + score`
- Ranks: `user_id + season_id`
- Daily Missions: `user_id + mission_date`
- Weekly Missions: `user_id + week_start_date`
- Rooms: `room_code`, `status + region`
- Chat Messages: `channel_type + channel_id + sent_at`
- Season Rewards: `user_id + season_id`
- Settings: `user_id + setting_key`
- Notifications: `user_id + is_read + created_at`

### 5.4 Partial and Conditional Indexes
Where supported and useful:
- Partial indexes for unread notifications.
- Partial indexes for active friend requests.
- Partial indexes for open rooms.
- Partial indexes for live match records.

---

## 6. Security Considerations
### 6.1 Authentication Data
- Store password hashes using strong one-way hashing.
- Never store plaintext passwords.
- Keep auth secrets isolated from general profile and gameplay data.
- Restrict auth table access to backend services that require it.

### 6.2 Principle of Least Privilege
- Separate read and write credentials by service.
- Do not let the frontend access PostgreSQL directly.
- Use narrow service accounts and role-based grants.
- Separate admin tooling access from gameplay services.

### 6.3 Sensitive Data Handling
- Mark moderation, security, and identity data as restricted.
- Avoid storing unnecessary personal data.
- Encrypt sensitive fields at rest where appropriate.
- Minimize retention of obsolete logs and messages.

### 6.4 Integrity Controls
- Match results should be written only by authoritative backend services.
- Rewards and progression updates should be idempotent.
- Prevent duplicate friend requests and duplicate inventory grants.
- Use unique constraints to block replayed submissions.

### 6.5 Abuse and Moderation
- Keep audit trails for bans, suspensions, and message moderation.
- Store soft-delete or moderation state instead of physically erasing important records when policy requires traceability.
- Rate limit social and chat writes.

### 6.6 Privacy
- Allow profile visibility controls.
- Respect chat and friend-block preferences.
- Support data export or deletion workflows if required by policy.

---

## 7. Scalability Considerations
### 7.1 Read Scaling
- Cache hot profile, cosmetics, leaderboard, and social presence data.
- Use read replicas for analytics, profile browsing, and leaderboard reads when appropriate.
- Keep the player-facing login and lobby paths light.

### 7.2 Write Scaling
- Match results should be written asynchronously after a match completes.
- Use append-oriented flows for match history and notification generation.
- Batch non-urgent updates such as leaderboard recomputation or analytics export.

### 7.3 Partitioning and Growth
The highest-growth tables will likely be:
- Player Match History
- Chat Messages
- Notifications
- Statistics history
- Mission progress history

For these, plan for:
- Time-based partitioning.
- Season-based partitioning.
- Archival policies for old records.
- Separate hot and cold access paths.

### 7.4 Data Lifecycle Strategy
- Match history can be retained long-term but partitioned by season.
- Chat logs may need shorter retention depending on moderation and policy.
- Notifications should be pruned or archived after they lose player value.
- Temporary room records should expire automatically.

### 7.5 Operational Scale
- Use materialized leaderboard snapshots rather than live aggregation on every request.
- Keep settings and inventory fetches fast through small, indexed reads.
- Avoid expensive cross-table joins in the main menu path.

---

## 8. Recommended Implementation Notes
### 8.1 Possible Supplementary Tables
Although this document covers the requested core set, the production implementation may later benefit from auxiliary tables such as:
- Seasons
- Game Modes
- Achievement Definitions
- Mission Definitions
- Leaderboard Snapshots
- Room Participants
- Notification Templates
- Chat Channels
- Inventory Transactions

These are optional implementation refinements and can be introduced as the system matures.

### 8.2 Preferred Storage Pattern
- Use normalized tables for authoritative state.
- Use summary or projection tables for fast UI reads.
- Use append-only logs for match results and moderation history.
- Use cache layers for highly volatile presence or lobby metadata.

### 8.3 Data Ownership Rules
Each backend service should own its data domain. Cross-domain changes should occur through service APIs or domain events rather than direct table writes from unrelated services.

---

## 9. Summary
The PostgreSQL design for Pixel Panic should emphasize authoritative records, low-latency reads for the player experience, and durable history for competitive integrity. The schema must support real-time multiplayer, cosmetics-only monetization, social systems, seasonal progression, chat, matchmaking, and ranked play without becoming fragile or overnormalized.

The key success factors are:
- Clear separation of identity, profile, gameplay, and economy data.
- Strong relational integrity through foreign keys and unique constraints.
- Indexes tuned for login, lobby, matchmaking, and post-match screens.
- Security boundaries that protect auth and moderation data.
- Scalability paths for match history, chat, notifications, and leaderboard growth.

This schema is suitable as the foundation for the first production release and can grow with the game over time.
