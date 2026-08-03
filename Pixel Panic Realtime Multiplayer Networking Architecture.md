# Pixel Panic Realtime Multiplayer Networking Architecture

## Purpose
This document defines the realtime multiplayer networking architecture for Pixel Panic. It is a professional, production-oriented design for a browser-based competitive 2D game using Node.js, Socket.IO, and server-authoritative networking.

This document covers movement synchronization, latency compensation, prediction, interpolation, reconciliation, collision handling, room creation, private rooms, public matchmaking, reconnect handling, AFK handling, host migration, server tick rate, bandwidth optimization, anti-cheat, packet structure, and security.

No code is included.

---

## 1. Networking Goals
The networking layer for Pixel Panic must satisfy several competing requirements:

- Deliver responsive movement and combat in browser clients.
- Preserve competitive fairness through server authority.
- Support public matchmaking and private rooms.
- Recover gracefully from mobile network interruptions.
- Keep packet sizes small enough for low-latency play.
- Prevent clients from asserting unauthorized game state.
- Remain operationally simple enough for an indie studio to maintain.

The architecture should prioritize consistency, observability, and security over excessive cleverness.

---

## 2. Recommended Technology Stack
### 2.1 Runtime
- **Node.js** for the realtime room servers and supporting network services.
- **TypeScript** for shared protocol contracts and server-side implementation consistency.

### 2.2 Transport and Session Layer
- **Socket.IO** as the primary realtime transport.
- WebSocket as the underlying realtime transport when available.
- Fallback support through Socket.IO transport negotiation when necessary.

### 2.3 Supporting Infrastructure
- **Redis** for room coordination, ephemeral state, presence, and queue reservations.
- **PostgreSQL** for durable match records, ranked results, and player history.
- **Load balancer / gateway** for region routing and Socket.IO ingress.
- **Message bus or event stream** for cross-service notifications such as match completion and reward updates.

### 2.4 Why Socket.IO
Socket.IO is a strong fit for Pixel Panic because it provides:
- Reliable browser support.
- Automatic reconnection support.
- Room and namespace abstractions.
- Event-based message semantics.
- Built-in heartbeat and connection lifecycle tooling.

Socket.IO does not remove the need for careful protocol design. It is a transport and room framework, not a replacement for authoritative simulation rules.

---

## 3. High-Level Networking Model
Pixel Panic should use a **server-authoritative room model**.

### 3.1 Authority Rules
- The server owns the truth for player position, collisions, hits, hazards, pickups, deaths, score, and match results.
- Clients send input intent, not state ownership.
- The server validates and simulates all gameplay-relevant actions.
- The client is allowed to predict for responsiveness, but never to decide outcomes.

### 3.2 Session Scope
Each realtime match runs inside a room-scoped simulation context.

A room is the authoritative boundary for:
- Player roster.
- Match phase.
- Arena state.
- Dynamic hazards.
- Spawn logic.
- Spectator participation.
- Final result emission.

### 3.3 Connection Model
Each connected player maintains:
- One authenticated Socket.IO session.
- One active room membership at a time during live play.
- A heartbeat and sequence tracking context.
- A reconnect token or session resume context.

---

## 4. Server Topology
### 4.1 Service Split
The realtime stack should be organized into three logical layers:

#### Gateway Layer
- Terminates public Socket.IO connections.
- Authenticates session tokens.
- Routes users to the correct room or region.
- Handles join, leave, resume, and reconnect handshakes.

#### Room Simulation Layer
- Owns the authoritative simulation for one or more rooms.
- Accepts player inputs.
- Advances simulation at a fixed tick rate.
- Emits snapshots and events.
- Finalizes match outcomes.

#### Coordination Layer
- Reserves rooms for matchmaking.
- Tracks room availability.
- Maintains ephemeral state in Redis.
- Coordinates reconnect placement.
- Supports private room lookup and host controls.

### 4.2 Deployment Strategy
There are two acceptable deployment shapes:
- **One room per process** for the cleanest isolation and debugging.
- **Multiple rooms per Node.js process** if memory and CPU usage are tightly controlled.

For Pixel Panic, a hybrid approach is recommended:
- Use a room worker model for production flexibility.
- Keep each room logically isolated even when multiple rooms share a process.
- Never let one room’s state access another room’s authoritative state directly.

### 4.3 Region Routing
Players should be routed to the nearest viable region before room assignment. Room assignment should prefer low latency over global balancing in real-time modes.

---

## 5. Packet Structure
Socket.IO event payloads should follow a stable, versioned message envelope.

### 5.1 Packet Design Principles
- Keep packets compact.
- Version all client-server messages.
- Separate input packets from state packets.
- Use typed event names and payload schemas.
- Include sequence and acknowledgment data where needed.
- Never trust client-provided authoritative state.

### 5.2 Recommended Envelope Fields
Every important realtime packet should conceptually include:
- Message type.
- Protocol version.
- Room identifier.
- Player identifier or session identifier.
- Sequence number.
- Client timestamp or tick reference when relevant.
- Server tick reference when relevant.
- Payload body.
- Optional acknowledgment reference.

### 5.3 Major Packet Categories
#### Authentication Packets
- Session begin.
- Token validation.
- Resume request.
- Resume accepted or rejected.

#### Room Packets
- Join room.
- Leave room.
- Room snapshot.
- Room update.
- Room settings change.

#### Input Packets
- Movement intent.
- Action intent.
- Emote or ping intent.
- Menu or ready-state intent.

#### Simulation Packets
- Authoritative snapshot.
- Delta update.
- Collision result.
- Damage result.
- Pickup result.
- Death or elimination event.

#### Operational Packets
- Heartbeat.
- Latency measurement.
- Disconnect notice.
- Reconnect resume.
- AFK warning.
- Server shutdown notice.

### 5.4 Payload Shape Guidance
Payloads should be small, binary-friendly where possible, and avoid deeply nested structures in the realtime path. Realtime updates should prefer compact identifiers and numeric fields over verbose strings.

---

## 6. Movement Synchronization
Movement is the most frequent realtime interaction and must feel responsive without trusting the client.

### 6.1 Client Responsibility
The client should:
- Read local input instantly.
- Predict movement visually.
- Display immediate animation and camera feedback.
- Buffer recent input history for reconciliation.

### 6.2 Server Responsibility
The server should:
- Validate movement intent.
- Apply movement speed limits.
- Resolve collisions.
- Authoritatively update position and facing.
- Reject impossible moves.

### 6.3 Synchronization Pattern
Recommended flow:
1. Player presses movement input.
2. Client immediately predicts motion locally.
3. Client sends input intent to server.
4. Server simulates movement on the next tick.
5. Server sends authoritative position or state delta.
6. Client reconciles if prediction diverged.

### 6.4 Movement Quality Rules
- Movement should remain smooth under moderate latency.
- Minor prediction error should be corrected softly when possible.
- Large errors should be corrected decisively to preserve fairness.
- Movement speed and acceleration should be designed to tolerate small timing drift.

### 6.5 Mobile Input Consideration
Mobile input should be normalized into the same movement intent model as keyboard input. Touch input must not create a separate gameplay authority path.

---

## 7. Latency Compensation
Pixel Panic should be fair across a range of network conditions, especially on mobile browsers.

### 7.1 Goals
- Keep combat readable under moderate latency.
- Reduce the feeling of “I pressed the button but nothing happened.”
- Avoid rewarding high-latency clients with unfair hit advantage.

### 7.2 Latency Compensation Strategy
- Buffer input slightly on the server to align action resolution with the correct simulation window.
- Use narrow compensation windows rather than broad rewinds.
- Prefer deterministic timing for hazards, traps, and collisions.
- Allow a short resync grace period for temporary jitter spikes.

### 7.3 What Should Be Compensated
- Movement input responsiveness.
- Action activation timing.
- Hazard interaction timing where fairness requires it.
- Reconnect re-entry timing.

### 7.4 What Should Not Be Over-Compensated
- Kill confirmations beyond a narrow fairness window.
- Resource theft or pickup disputes after state has already resolved server-side.
- Long rewind windows that create exploit potential.

### 7.5 Design Rule
Latency compensation should make the game feel fair, not create speculative outcomes that the server later has to undo too aggressively.

---

## 8. Prediction
Prediction is required so the game feels responsive in the browser.

### 8.1 Client Prediction Scope
The client may predict:
- Player movement.
- Animation transitions.
- Camera follow.
- Local effects such as trails or dodge feedback.
- Cosmetic-only reactions.

### 8.2 Prediction Boundaries
The client must not predict:
- Final damage results.
- Powerup ownership.
- Elimination outcomes.
- Scoring.
- Ranked reward results.

### 8.3 Prediction Philosophy
Prediction should be conservative. The goal is to reduce perceived input lag, not to create a second game simulation on the client.

### 8.4 Input Buffering
The client should retain a short input history so the server can reconcile accurately and the client can replay buffered commands if needed.

### 8.5 Visual Continuity
When prediction diverges, the client should favor smooth correction over abrupt visual failure, except when the correction would misrepresent gameplay.

---

## 9. Interpolation
Interpolation is needed for smooth rendering of remote players and world events.

### 9.1 Purpose
- Smooth out jitter in network updates.
- Prevent remote players from appearing to teleport between packets.
- Create visually stable motion even under moderate packet variability.

### 9.2 Interpolated Entities
- Other players.
- Spectator targets.
- Non-critical moving hazards.
- Cosmetic or visual effects tied to remote entities.

### 9.3 Interpolation Rules
- Interpolate between authoritative snapshots using a small buffer delay.
- Clamp interpolation when the server state changes abruptly due to elimination or teleport-like events.
- Avoid over-smoothing combat-relevant motion.

### 9.4 Visual vs Gameplay State
Interpolation should only affect what is drawn, not what the server believes is true. The client should never use interpolated state as the basis for local authority.

---

## 10. Reconciliation
Reconciliation is how the client corrects itself after prediction diverges from the server.

### 10.1 Reconciliation Flow
1. Client predicts state locally.
2. Server sends authoritative state snapshot or delta.
3. Client compares snapshot to predicted state.
4. If divergence is small, blend or adjust softly.
5. If divergence is large, snap to the server state and replay buffered input when appropriate.

### 10.2 Reconciliation Cases
- Position drift.
- Movement through blocked spaces.
- Action timing disagreement.
- Pickup race outcomes.
- Hazard boundary disagreement.

### 10.3 Correction Policy
- Minor corrections should feel invisible or nearly invisible.
- Major corrections must prioritize truth and fairness over continuity.
- Reconciliation should never create duplicate events or duplicate rewards.

### 10.4 Anti-Desync Rule
The client should always preserve server sequence ordering so stale packets cannot overwrite newer authoritative state.

---

## 11. Collision Handling
Collision handling must be server authoritative and deterministic enough to support fair combat.

### 11.1 Collision Ownership
- The server owns all solid-world collision decisions.
- The server resolves entity-to-entity conflicts.
- The client may display predicted collision responses but cannot enforce them.

### 11.2 Collision Types
- Player vs wall.
- Player vs obstacle.
- Player vs hazard.
- Player vs pickup.
- Player vs player.
- Projectile or trap vs environment.
- Trap or hazard vs entity.

### 11.3 Collision Resolution Rules
- Resolve movement against world geometry first.
- Resolve hazard and elimination logic second.
- Resolve pickups and item ownership with strict server priority.
- Resolve player-versus-player interactions according to match rules and team rules.

### 11.4 Deterministic Expectations
Deterministic collision handling is highly desirable because it reduces dispute and replay complexity. Even if the entire runtime is not perfectly deterministic, collision outcomes should be consistent and testable on the server.

### 11.5 Fairness Rules
- No collision should depend on client frame rate.
- No local visual overlap should imply gameplay success.
- Edge cases should favor clearly documented rules over ambiguous heuristics.

---

## 12. Room Creation
Room creation is the foundation of both public matches and private sessions.

### 12.1 Room Creation Flow
1. A lobby or matchmaking request asks for a room.
2. The coordination layer reserves capacity.
3. A room is created with region, mode, map, and rule metadata.
4. The room is published to the appropriate Socket.IO namespace or room registry.
5. Players are invited or routed into the room.

### 12.2 Room Metadata
A room should include:
- Room identifier.
- Room code for private rooms.
- Region.
- Mode.
- Map or map pool.
- Player cap.
- Team rules.
- Privacy state.
- Match settings seed.
- Host identity if applicable.

### 12.3 Room Lifecycle
- Created.
- Filling.
- Ready.
- Active.
- Finished.
- Archived or destroyed.

### 12.4 Creation Safety
Room creation must be idempotent where possible so retries from network instability do not create duplicate live sessions.

---

## 13. Private Rooms
Private rooms support friends, tournaments, practice, and creator-led sessions.

### 13.1 Private Room Requirements
- Join code or invite link.
- Optional password.
- Host control over room settings.
- Spectator permissions.
- Match start control.
- Friendly disconnect handling.

### 13.2 Privacy Rules
- Private room membership should be explicit.
- Unauthorized join attempts must be rejected cleanly.
- Host control should be limited to settings the game allows.

### 13.3 Operational Behavior
Private rooms should use the same underlying realtime infrastructure as public rooms but bypass public matchmaking logic. They should still be authoritative, rate-limited, and logged.

### 13.4 Tournament Use
For competitive events, private rooms should support observer access, delayed broadcast options, and stable room codes.

---

## 14. Public Matchmaking
Public matchmaking should be optimized for speed, fairness, and region quality.

### 14.1 Matchmaking Objectives
- Find a match quickly.
- Place players in an appropriate region.
- Balance skill level in ranked queues.
- Respect party size and mode constraints.
- Reserve a room before players enter the realtime session.

### 14.2 Matchmaking Flow
1. Player joins queue.
2. Matchmaking service evaluates skill, region, party size, and mode.
3. Service reserves or selects a room.
4. Players are attached to that room.
5. Socket.IO room join is completed.
6. Countdown and match start proceed.

### 14.3 Queue Types
- Casual public matchmaking.
- Ranked public matchmaking.
- Limited-time event queues.
- Team queues.

### 14.4 Matchmaking Safeguards
- Avoid matching brand-new players against highly experienced players too early.
- Avoid over-prioritizing low queue time at the expense of region quality.
- Reject mismatched party compositions when the mode cannot support them fairly.

---

## 15. Reconnect Handling
Reconnect handling is critical for browser and mobile play.

### 15.1 Reconnect Goals
- Let short disconnects recover without ruining the match.
- Prevent exploitative reconnect abuse.
- Restore authoritative state quickly.
- Preserve room membership when possible.

### 15.2 Reconnect Flow
1. Client disconnects unexpectedly.
2. Server retains session state for a grace period.
3. Client reconnects with a resume token.
4. Server validates identity, room, and match phase.
5. Server sends a fresh authoritative snapshot.
6. Client resynchronizes and returns to live play.

### 15.3 Resume Window
Reconnect grace periods should be long enough for mobile network handoffs and short enough to protect match integrity.

### 15.4 Reconnect Failure Cases
- Match already ended.
- Resume token expired.
- Player was removed or penalized.
- Room no longer exists.

### 15.5 UX Rule
A reconnecting player should see clear status, not a silent failure or ambiguous loading loop.

---

## 16. AFK Handling
AFK handling is necessary to protect match quality and prevent queue abuse.

### 16.1 Detection Signals
- No input for a defined period.
- Repeated absence of movement or actions.
- Window focus loss combined with no recent activity.
- Reconnect loops or idle presence in room.

### 16.2 AFK Policy
- First stage: warning or soft reminder.
- Second stage: AFK flag and reduced matchmaking trust.
- Third stage: removal from match or penalties based on mode and severity.

### 16.3 Design Considerations
- Do not punish legitimate short interruptions too aggressively in casual play.
- Use stricter handling in ranked and private competitive sessions.
- Avoid false positives during login, loading, or pause states.

### 16.4 Implementation Note
AFK logic should live partly in the room server and partly in the coordination layer so it can detect both local inactivity and broader connection issues.

---

## 17. Host Migration
Host migration is only relevant for private rooms or host-driven social sessions. It should not be used as the primary architecture for authoritative public matches.

### 17.1 Recommendation
- Public matches should remain server-authoritative and not depend on a player host.
- Private rooms may support host reassignment if the room owner disconnects.

### 17.2 Host Migration Strategy
If host migration is supported in private rooms:
- Transfer host privileges to a suitable participant.
- Preserve room code and settings.
- Keep the underlying authoritative server unchanged.

### 17.3 Why Not Player-Hosted Authority
Player-hosted authority increases cheat risk, inconsistency, and reconnect complexity. For Pixel Panic, the host should only be a social or administrative role, not the simulation authority.

---

## 18. Server Tick Rate
### 18.1 Recommended Tick Rate
Use a fixed server tick rate suitable for an arcade competitive action game. A practical target is in the range of **20 to 30 ticks per second**, with the exact final rate chosen after playtesting and bandwidth profiling.

### 18.2 Tick Rate Goals
- Preserve responsiveness.
- Keep simulation costs manageable.
- Avoid unnecessary bandwidth overhead.
- Maintain consistent hazard and collision timing.

### 18.3 Tick Design
- Input can be sampled continuously by the client, but server simulation advances on fixed ticks.
- Snapshots should be emitted at a separate cadence if needed.
- The tick rate should be stable rather than adaptive in the core simulation layer.

### 18.4 Design Rule
Do not change gameplay timing based on frame rate. The server tick is the simulation clock.

---

## 19. Bandwidth Optimization
Pixel Panic must remain playable on constrained browser connections.

### 19.1 Optimization Principles
- Send only essential authoritative data.
- Prefer deltas over full snapshots.
- Use compact numeric identifiers.
- Avoid duplicate state transmission.
- Compress repeated event types.

### 19.2 Update Strategy
- High-frequency data: player input and critical state.
- Medium-frequency data: entity positions and hazard changes.
- Low-frequency data: room settings, lobby metadata, and non-critical UI updates.

### 19.3 Interest Management
A client should only receive state for entities and events relevant to the current room view. Spectators may receive a different data stream than active players.

### 19.4 Payload Minimization
- Keep message fields small.
- Avoid nested verbose JSON in the hot path if a more compact transport format is available inside Socket.IO payloads.
- Remove redundant fields from repeated updates.

### 19.5 Adaptive Safety
The server may reduce non-critical update frequency under load, but it must not weaken gameplay authority or fairness.

---

## 20. Anti-Cheat
The networking architecture should be hardened against common multiplayer abuse.

### 20.1 Core Anti-Cheat Principles
- Server authority over all gameplay outcomes.
- Input validation on every action.
- Rate limiting on suspicious patterns.
- Session-bound room joins.
- Replay protection on sensitive messages.

### 20.2 Common Abuse Vectors to Block
- Speed hacking.
- Teleport or impossible movement.
- Packet replay.
- Fake room joins.
- Unauthorized room control.
- Spoofed results or rewards.
- AFK exploitation to farm rewards.

### 20.3 Detection Strategies
- Validate movement against tick history.
- Validate timing against cooldowns and action windows.
- Flag impossible interactions or impossible pickup sequences.
- Log high-confidence anomalies for moderation review.

### 20.4 Security Posture
Anti-cheat should be layered. No single client-side system is sufficient. Server validation, rate limiting, token control, and anomaly detection must work together.

---

## 21. Security
Security and networking are tightly linked in a real-time browser game.

### 21.1 Authentication Security
- Use short-lived access tokens.
- Use session resume tokens with limited scope.
- Rotate or invalidate session references on logout and suspicious activity.
- Reject unauthenticated room joins.

### 21.2 Socket.IO Security
- Authenticate immediately after connection.
- Enforce namespace and room authorization.
- Reject invalid room codes and forged player identity.
- Validate all event payloads on receipt.

### 21.3 Transport Security
- Use TLS for all public traffic.
- Keep internal service communication segregated.
- Do not expose internal room state directly to the public internet.

### 21.4 Data Security
- Never trust client-reported rank, rewards, or match outcomes.
- Store authoritative results only from the server simulation layer.
- Log sensitive admin actions.

### 21.5 Abuse Resistance
- Rate limit room joins, reconnect attempts, friend invites, and chat-adjacent network actions.
- Use moderation hooks for repeated abuse patterns.
- Detect suspicious session churn or reconnect abuse.

---

## 22. Room State and Lifecycle
### 22.1 Room Phases
- Creating.
- Waiting for players.
- Countdown.
- Active match.
- End of match.
- Results finalization.
- Destroyed or archived.

### 22.2 State Ownership
- The room server owns match state.
- The matchmaking service owns pre-match placement state.
- The frontend owns display state only.

### 22.3 Finalization Flow
At match end, the server should:
- Freeze active simulation.
- Produce authoritative outcomes.
- Emit results to backend persistence.
- Release or archive room resources.

---

## 23. Public vs Private Room Behavior
### 23.1 Public Rooms
- Created by matchmaking.
- Use skill, region, and mode constraints.
- May support spectators depending on mode.
- Prioritize fairness and queue efficiency.

### 23.2 Private Rooms
- Created by a player host or organizer.
- Use room codes or direct invites.
- May allow custom settings.
- Prioritize convenience and social play.

### 23.3 Shared Behaviors
Both room types should share:
- Same authoritative simulation rules.
- Same packet structures.
- Same anti-cheat validation.
- Same reconnect semantics.

---

## 24. Failure Handling
### 24.1 Connection Loss
- Preserve room membership for a grace period.
- Present a reconnecting state to the player.
- Continue match simulation regardless of one client’s transient failure.

### 24.2 Server Failure
- Mark the room as failed or recovered depending on severity.
- Keep match results consistent with operational policy.
- If a full room failure occurs, handle compensation or rematch policy outside the realtime layer.

### 24.3 Message Loss or Ordering Issues
Socket.IO provides reliability features, but application-level sequence handling is still required for authoritative updates. Stale or duplicate packets should be ignored safely.

---

## 25. Observability
The realtime stack should be easy to debug.

### 25.1 Required Telemetry
- Connection success rate.
- Match join latency.
- Tick duration.
- Snapshot size.
- Packet loss indicators.
- Reconnect frequency.
- AFK removals.
- Room creation failures.
- Server CPU and memory utilization.

### 25.2 Logging Requirements
- Log room lifecycle events.
- Log suspicious packet patterns.
- Log reconnect outcomes.
- Log server-side validation rejections.
- Keep logs structured and queryable.

### 25.3 Operational Alerts
- Room creation failures above threshold.
- Elevated reconnect failures.
- Tick overruns.
- Packet amplification anomalies.
- Unusual anti-cheat flag rates.

---

## 26. Practical Implementation Guidance
### 26.1 What Should Be Kept Simple
- One authoritative game simulation per room.
- A small, well-defined event protocol.
- Fixed tick advancement.
- Clear reconnect and result finalization rules.

### 26.2 What Should Be Avoided Early
- Peer-to-peer authority.
- Complex rollback netcode unless demonstrably necessary.
- Overly chatty update streams.
- Duplicate sources of truth for player state.

### 26.3 Launch Recommendation
Start with:
- Node.js room servers.
- Socket.IO for realtime transport.
- Server-authoritative simulation.
- Fixed tick rate.
- Redis-backed room coordination.
- PostgreSQL-backed result persistence.

This gives the team a stable and understandable networking foundation without overengineering the first release.

---

## 27. Summary
Pixel Panic should use a server-authoritative realtime multiplayer model built on Node.js and Socket.IO. The server must own the truth for motion, collisions, hazards, and outcomes, while the client predicts and interpolates for responsiveness. Reconnect support, AFK handling, room lifecycle control, and bandwidth discipline are essential for a browser game that targets both desktop and mobile users.

The preferred architecture is simple in concept but strict in execution:
- Clients send intent.
- Servers simulate truth.
- Rooms isolate matches.
- Private and public sessions share the same authoritative foundation.
- Security and anti-cheat are built into the protocol, not bolted on later.
