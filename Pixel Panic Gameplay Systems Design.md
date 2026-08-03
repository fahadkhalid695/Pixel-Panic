# Pixel Panic Gameplay Systems Design

## Purpose
This document defines the complete gameplay system design for Pixel Panic. It expands the approved game vision into concrete mechanic rules for the core arena experience and the systems that support long-term competitive play.

The focus is on how the game actually plays: movement, collision, powerups, weapons, hazards, ice, bombs, coins, XP, respawn, scoring, victory conditions, player elimination, ranking points, MVP selection, difficulty balancing, rubber banding, and map rotation.

No code is included.

---

## 1. Core Gameplay Identity
Pixel Panic is a fast top-down competitive arena game built around movement control, explosive area denial, hazard management, and opportunistic powerup play. It should feel easy to understand on first contact, but highly expressive once players learn timing, map control, and match tempo.

The game’s gameplay identity should be defined by three things:
- **Spatial pressure**: players shape the arena through bombs, hazards, ice, and obstacles.
- **Tempo control**: powerups and map events create shifts in who controls the pace of a match.
- **Outcome clarity**: players always understand why they won, lost, scored, or were eliminated.

The design goal is not to overwhelm players with systems. It is to create a small number of strong systems that interact cleanly and produce emergent strategy.

---

## 2. Core Gameplay Loop
The moment-to-moment loop should be simple:

1. Move to claim space and avoid danger.
2. Collect powerups and coins.
3. Use bombs, weapons, or character tools to force movement.
4. Trap opponents against hazards, ice, and map geometry.
5. Survive long enough to become stronger.
6. Win by elimination, score, objective control, or final placement depending on mode.

The ideal match should create a clear progression of tempo:
- **Opening**: players explore, collect, and avoid early traps.
- **Midgame**: the board opens up, aggressive pressure begins.
- **Endgame**: hazard intensity rises and decisions become decisive.

---

## 3. Movement
### 3.1 Movement Model
Movement is the most fundamental skill in Pixel Panic. The game should use responsive 2D top-down movement with clean directional intent.

Players should be able to:
- Move in the four cardinal directions with smooth analog-like responsiveness.
- Stop cleanly without drifting.
- Weave around hazards and obstacles.
- Change direction quickly for trap escapes.

### 3.2 Movement Feel
Movement should feel:
- Fast enough to stay exciting.
- Heavy enough that positioning matters.
- Predictable enough for competitive play.

The player should always feel in control, but never so mobile that traps become trivial.

### 3.3 Movement Constraints
- Players cannot clip through solid terrain.
- Movement should respect hazard and collision rules.
- Movement speed is affected by certain powerups, ice surfaces, and status effects.
- Temporary speed boosts should never make the game unreadable.

### 3.4 Advanced Movement Expression
Movement depth comes from:
- Corner control.
- Path selection.
- Timing around bomb placement.
- Reading enemy intention.
- Navigating compressed endgame space.

### 3.5 Movement and Skill
The movement system should reward players who understand spacing. Small mistakes should be recoverable early in a match but increasingly expensive as the arena fills with threats.

---

## 4. Collision
### 4.1 Collision Philosophy
Collision must always be authoritative, readable, and consistent. Players should never feel that collisions are arbitrary or dependent on frame rate.

### 4.2 Collision Types
Pixel Panic uses several collision layers:
- **World collision**: walls, blocks, locked gates, and map boundaries.
- **Entity collision**: other players, bombs, pushable objects, and hazards.
- **Interaction collision**: powerups, coins, switches, and pickups.
- **Effect collision**: blast lines, ice spread, shock zones, and special weapon areas.

### 4.3 Collision Rules
- World collision prevents movement through solid tiles.
- Entity collision may block movement, apply shove rules, or allow overlap depending on mode.
- Interaction collision should be forgiving enough to make pickups feel responsive.
- Effect collision should be clear before activation whenever possible.

### 4.4 Collision Priorities
When multiple collisions happen at once, the priority order should usually be:
1. Hard map bounds.
2. Solid walls and blocks.
3. Active hazards and blast effects.
4. Player-to-player resolution.
5. Pickups and coin collection.

### 4.5 Readability Rule
If a collision feels unfair, the game should either expose a warning earlier or simplify the rule. Hidden collision logic creates distrust in a competitive game.

---

## 5. Powerups
### 5.1 Powerup Role
Powerups are the primary short-term progression mechanic in a match. They create momentum swings and reward map control.

### 5.2 Powerup Categories
Powerups should be grouped into these broad types:
- **Mobility**: speed increase, dash recovery, ice resistance.
- **Offense**: bomb count, blast radius, weapon charge rate.
- **Defense**: shield, freeze immunity, one-hit protection in limited modes.
- **Utility**: reveal, scan, trap sensing, hazard immunity windows.
- **Economy**: coin bonus or score multiplier in modes that support it.

### 5.3 Powerup Acquisition
Powerups should typically come from:
- Breaking destructible objects.
- Capturing map objectives.
- Defeating certain hazards or enemies.
- Event-based map spawns.
- Mode-specific crates or drops.

### 5.4 Powerup Balance Rules
- Early powerups should matter immediately.
- Stackable effects should use caps or diminishing returns.
- No single powerup should create permanent dominance too early.
- The most powerful items should usually carry risk or context dependence.

### 5.5 Powerup Visibility
Powerups must be visually distinctive and readable in combat. Players should understand at a glance whether a pickup is mobility, offense, defense, or utility.

---

## 6. Weapons
### 6.1 Weapon Definition
Weapons are the active offensive tools that a character or loadout can deploy beyond basic movement. In Pixel Panic, bombs are the core weapon family, but additional weapon types can exist as character abilities, pickups, or mode-specific tools.

### 6.2 Weapon Philosophy
Weapons should:
- Create space denial.
- Force movement decisions.
- Be readable before impact.
- Have counterplay.
- Feel different from one another without fragmenting the game.

### 6.3 Weapon Categories
Recommended weapon families include:
- **Bombs / charges**: delayed area denial with blast lines.
- **Thrown gadgets**: mines, freeze pellets, or pulse devices.
- **Directional attacks**: short-range sweeps or beams for specific characters.
- **Area control tools**: barriers, traps, or zone effects.

### 6.4 Weapon Rules
- Most weapons should be limited by cooldown, ammo, or placement rules.
- Active weapons should never be so fast that they remove the need for positioning.
- Weapon usage should remain understandable to new players within a few minutes.

### 6.5 Weapon Counters
Counterplay can include:
- Movement timing.
- Safe lane creation.
- Shielding.
- Ice resistance.
- Breaking line of sight with map structure.
- Outspacing or baiting the attack.

---

## 7. Bomb Mechanics
Bombs are the core offensive and territory-shaping mechanic in Pixel Panic.

### 7.1 Bomb Identity
Bombs represent delayed area denial. They are the system that creates traps, forces displacement, and defines the game’s tactical board state.

### 7.2 Bomb Placement
- Bombs are placed on valid tiles or valid placement zones.
- Placement must be immediate and predictable.
- Bombs should snap cleanly to grid or placement rules depending on map design.
- A player should not be able to place a bomb where it creates impossible ambiguity.

### 7.3 Bomb Life Cycle
1. Player places bomb.
2. Bomb arms for a short fuse.
3. Bomb becomes dangerous and announces its imminent detonation.
4. Bomb explodes in its defined pattern.
5. Blast interacts with terrain, enemies, ice, and secondary effects.
6. Any residual zone or chain reaction completes.

### 7.4 Bomb Properties
Bombs can vary by:
- Fuse duration.
- Blast radius.
- Blast shape.
- Chain reaction behavior.
- Interaction with ice.
- Interaction with destructible walls.
- Owner capacity limits.

### 7.5 Chain Reactions
Bombs should be able to trigger other bombs or map reactions when the game mode allows it. Chain reactions are one of the most satisfying systems in the game, but they must remain readable.

Rules for chain reactions:
- Chain ignition must be visually telegraphed.
- Chain triggers should respect server timing.
- Chain reactions must never feel random or invisible.

### 7.6 Bomb Counterplay
Players counter bombs by:
- Moving out of the blast path.
- Using ice or barriers to redirect pressure.
- Baiting placement.
- Punishing overcommitment.
- Managing spacing around corners and choke points.

### 7.7 Bomb Balance
Bombs should be threatening without becoming oppressive. The skill expression comes from choosing when and where to place them, not from raw spam.

---

## 8. Ice Mechanics
Ice is the game’s secondary signature mechanic and should create a distinct layer of movement and control.

### 8.1 Ice Design Goal
Ice introduces altered movement, frozen surfaces, and temporary control disruption. It creates a second kind of arena pressure besides bombs.

### 8.2 Ice States
Possible ice interactions include:
- **Frozen floor**: movement slides after entry.
- **Freeze tiles**: temporary terrain that changes pathing.
- **Frozen players**: short immobilization if hit by a strong ice effect.
- **Ice barriers**: breakable frozen obstacles.
- **Ice spread**: expanding frozen zones in certain modes or map events.

### 8.3 Ice Movement Behavior
When a player enters ice:
- Movement should become less immediate.
- Direction changes should feel delayed or slippery.
- Stop distance should increase.
- Control should remain recoverable, not helpless.

### 8.4 Freeze Rules
Hard freezes should be short and heavily telegraphed. Frozen states are useful for combo setups and map control, but they should not produce long lockouts in competitive modes.

### 8.5 Ice and Bomb Interaction
Ice should create interesting bomb play:
- Ice may slow escape from a blast zone.
- Bomb explosions may melt ice or shatter frozen barriers.
- Ice-based abilities may alter blast behavior in certain character kits or modes.

### 8.6 Ice Counterplay
- Stay out of predicted freeze lanes.
- Use movement tools before entering icy corridors.
- Prioritize ice-clearing or mobility powerups.
- Learn which maps or modes feature high ice density.

### 8.7 Ice Balance
Ice should create tension and positioning complexity, not permanent frustration. Players must understand that frozen states are a tactical hazard, not a random punishment.

---

## 9. Coins
### 9.1 Coin Role in Match
Coins are the in-game collectible economy used for immediate score pressure, optional in-match rewards, or post-match progression depending on mode.

### 9.2 Coin Sources
Coins can come from:
- Map pickups.
- Breaking obstacles.
- Eliminating opponents in modes that reward combat.
- Objective holds.
- Hazard interaction bonuses.

### 9.3 Coin Uses
Depending on mode, coins may:
- Increase score.
- Contribute to victory conditions.
- Reward performance.
- Feed meta progression after the match.

### 9.4 Coin Design Rules
- Coins must be easy to see.
- Coin collection should feel rewarding but not mandatory for survival in all modes.
- Coin risk should be meaningful when placed in contested space.

### 9.5 Coin Balance
Coins are most useful when they create optional contest points. They should not turn every match into pure farming.

---

## 10. XP
### 10.1 XP Role
XP is the account progression currency that rewards playtime, completion, and performance.

### 10.2 XP Sources
XP should be granted for:
- Match completion.
- Placement and victory bonuses.
- Performance milestones.
- Daily and weekly missions.
- Seasonal events.
- Social play participation when appropriate.

### 10.3 XP Philosophy
XP should reward both effort and success. A player should still feel progress from a short session even if they do not win.

### 10.4 XP Curve
- Early levels should be fast and rewarding.
- Mid-level progression should slow gradually.
- Late progression should support long-term retention without feeling grindy.

### 10.5 XP and Balance
XP must never alter gameplay power. It should unlock cosmetics, titles, and status only.

---

## 11. Respawn
### 11.1 Respawn Philosophy
Respawn should depend on mode. Some modes are elimination-based and do not respawn players, while others use timed respawns or limited life systems to keep team modes active.

### 11.2 Respawn Models
Recommended models include:
- **No respawn**: classic elimination or survival modes.
- **Timed respawn**: player returns after a countdown in team modes.
- **Wave respawn**: players return in synchronized groups.
- **Limited lives**: each player has a small number of revives or lives.

### 11.3 Respawn Rules
- Respawn should never be instant unless the mode explicitly demands high chaos.
- Spawn points must be safe enough to avoid immediate spawn camping.
- The respawn delay should be long enough to matter but short enough to keep players engaged.

### 11.4 Respawn Safety
Spawn protection should be limited and clearly bounded so it does not become a combat exploit.

### 11.5 Respawn and Match Flow
Respawn supports team tempo by preventing early exits from turning a match into spectator boredom. In pure elimination modes, respawn is replaced by lobby return and post-match flow.

---

## 12. Scoring
### 12.1 Scoring Philosophy
Scoring should reflect skillful play, objective contribution, and survival under pressure. The best scoring systems reward the behaviors the game wants to encourage.

### 12.2 Score Sources
Score can come from:
- Eliminations.
- Objective control.
- Survival time.
- Coin collection.
- Hazard manipulation.
- Assistance or trap setups.
- Team support actions in team modes.

### 12.3 Score Clarity
Players should always understand why they earned points. Scoring should be exposed in post-match breakdowns and, where appropriate, in real time.

### 12.4 Score Integrity
Scores should be server-authoritative and computed from authoritative match events only.

---

## 13. Victory Conditions
### 13.1 Victory Philosophy
Victory conditions must be clear before the match starts and obvious during the match.

### 13.2 Victory Types
The game should support several victory structures:
- **Last player standing**.
- **Last team standing**.
- **Highest score at timer end**.
- **Objective completion threshold**.
- **Placement-based ranking**.

### 13.3 Win State Clarity
The game should not let players wonder who is winning. UI and match flow should show placement, score gap, or objective control clearly.

### 13.4 Endgame Design
Endgame should force resolution through hazard compression, score pressure, or objective escalation. The final phase must be decisive and short.

---

## 14. Player Elimination
### 14.1 Elimination Philosophy
Elimination should feel earned, readable, and final within the context of the mode.

### 14.2 Elimination Triggers
A player can be eliminated by:
- Bomb blast.
- Weapon hit.
- Hazard damage.
- Ice-related incapacitation in applicable modes.
- Objective-specific failure state.
- Running out of lives.

### 14.3 Elimination Feedback
On elimination, the game should clearly show:
- What caused the elimination.
- Who or what caused it.
- Any relevant score or rank impact.
- Whether a respawn will occur.

### 14.4 Elimination Fairness
Players should never feel that elimination was hidden or arbitrary. Good audiovisual feedback is essential.

---

## 15. Ranking Points
### 15.1 Ranking Philosophy
Ranking points measure competitive performance over time. They should reflect skill and consistency, not just volume of play.

### 15.2 Ranking Inputs
Ranking points may be influenced by:
- Match outcome.
- Placement.
- Opponent strength.
- Party composition and queue type.
- Performance metrics such as survival or objective control.

### 15.3 Ranking Output
Ranking points should map to:
- Visible rank tiers.
- Hidden or semi-hidden MMR.
- Seasonal placement and rewards.

### 15.4 Ranking Integrity
- Rank updates should be server-authoritative.
- Repeated disconnect abuse should not grant protection or free rank safety.
- Rank gain should scale with opponent quality to reduce exploitation.

### 15.5 Match Type Differences
Casual matches may use soft rating signals for matchmaking while ranked modes use stricter point changes and more exact season progression.

---

## 16. MVP Selection
### 16.1 Definition
MVP means Most Valuable Player. It is the post-match recognition system used to highlight strong individual contribution, especially in team modes.

### 16.2 MVP Criteria
MVP should be based on a weighted combination of:
- Objective impact.
- Eliminations.
- Survival.
- Support contribution.
- Damage or denial contribution.
- Clutch moments.
- Team win contribution.

### 16.3 MVP by Mode
- In team modes, MVP should favor the player who most influenced the team victory.
- In FFA modes, the system can instead use a top performer or match standout award.
- In objective modes, MVP should strongly prioritize objective contribution over raw elimination count.

### 16.4 MVP Presentation
MVP should be presented as a celebratory but not overpowering recognition card with clear explanation of why the player was selected.

### 16.5 MVP Design Rule
MVP should reward useful play, not only kill count. This keeps support-oriented and objective-oriented styles valuable.

---

## 17. Difficulty Balancing
### 17.1 Difficulty Philosophy
Pixel Panic should be easy to start and deep to master. Difficulty should come from player interaction, map reading, and timing, not from obscure rules.

### 17.2 Difficulty Layers
- **Onboarding difficulty**: introduce only essential mechanics.
- **Casual difficulty**: low pressure, broad accessibility, learning-friendly maps.
- **Ranked difficulty**: stronger opponents, tighter timing, sharper punish windows.
- **Event difficulty**: seasonal modifiers that alter tempo without breaking clarity.

### 17.3 Balance Goals
- New players should understand basic survival quickly.
- Intermediate players should feel growth through map knowledge.
- Expert players should improve through precision, prediction, and match control.

### 17.4 Difficulty Tuning Inputs
Balance should consider:
- Map density.
- Bomb fuse and blast timing.
- Ice prevalence.
- Powerup distribution.
- Respawn windows.
- Hazard speed.
- Match length.

### 17.5 Adaptive Difficulty
Adaptive difficulty should be minimal in competitive modes. In onboarding or bot-supported training modes, it can be used to keep early players engaged without being overwhelmed.

---

## 18. Rubber Banding
### 18.1 Rubber Banding Philosophy
Rubber banding should be used sparingly. It can help keep casual matches exciting, but it must not undermine competitive integrity.

### 18.2 When Rubber Banding Is Acceptable
- Casual party modes.
- Beginner onboarding modes.
- Some objective modes where comeback pacing matters.
- Event modes with intentionally chaotic rules.

### 18.3 Rubber Banding Types
Possible comeback assists include:
- Slightly better powerup odds for trailing players.
- Controlled hazard pressure on leading positions.
- Bonus objectives that appear for weaker teams.
- Respawn advantages in casual team modes.

### 18.4 What Rubber Banding Must Not Do
- It must not secretly invalidate a player’s skill.
- It must not distort ranked fairness.
- It must not create obvious manipulation that players can exploit.

### 18.5 Design Rule
Rubber banding should feel like match pacing, not like the game is cheating on behalf of the losing side.

---

## 19. Map Rotation
### 19.1 Map Rotation Philosophy
Map rotation should keep matches fresh while preserving player mastery. The system should avoid overexposing players to too many unfamiliar maps at once.

### 19.2 Rotation Structure
Use a curated rotation with:
- A core set of staple maps.
- Seasonal or event-specific maps.
- Ranked rotation that is more controlled.
- Casual rotation that is broader and more varied.

### 19.3 Rotation Goals
- Prevent map fatigue.
- Encourage strategic adaptation.
- Support seasonal theming.
- Keep competitive queues predictable.

### 19.4 Rotation Rules
- Ranked modes should rotate slowly and predictably.
- Casual modes can rotate more aggressively.
- New maps should be introduced with special weighting before full rotation inclusion.
- Maps with balance issues should be temporarily removed or restricted.

### 19.5 Map Selection Logic
Map selection can be influenced by:
- Mode.
- Region.
- Season.
- Party preference where allowed.
- Recent play history to reduce repetition.

### 19.6 Map Quality Gates
Every map in rotation should pass:
- Spawn fairness tests.
- Choke point testing.
- Line-of-sight abuse review.
- Bomb and ice interaction review.
- Mobile readability checks.

---

## 20. System Interactions
### 20.1 Movement and Bombs
Movement and bombs create the core pressure loop. Players move to threaten spaces and place bombs to force future movement.

### 20.2 Collision and Ice
Collision defines where players can go. Ice changes how confidently they can get there.

### 20.3 Powerups and Balance
Powerups accelerate the match tempo. Balance systems ensure they do not make one player unbeatable too early.

### 20.4 Scoring and Victory
Scoring feeds the mode’s victory conditions. Victory is not always elimination; in some modes it is accumulated superiority.

### 20.5 Ranking and MVP
Ranking points reward competitive outcomes, while MVP rewards standout contribution. They should not always point to the same player.

---

## 21. Design Rules Summary
- Movement must be responsive and readable.
- Collision must be authoritative and consistent.
- Powerups should create momentum, not chaos.
- Weapons should shape space, not erase strategy.
- Bombs are the core trap tool and must remain legible.
- Ice should add tactical friction without becoming frustrating.
- Coins should reward contestable play.
- XP should drive meta progression only.
- Respawn must depend on mode.
- Scoring must explain itself.
- Victory conditions must be clear from match start.
- Elimination must be fair and visible.
- Ranking points must be server-authoritative.
- MVP should reward meaningful contribution, not just kills.
- Difficulty should be tuned through transparency and pacing.
- Rubber banding should be minimal and mode-dependent.
- Map rotation should preserve freshness without destroying mastery.

---

## 22. Final Summary
Pixel Panic works because its systems are small enough to understand quickly and deep enough to create long-term competition. Movement, bombs, ice, and map control form the tactical core. Coins, XP, ranking, and MVP recognition form the progression and social reinforcement layer. Difficulty balancing, rubber banding, and map rotation shape the long-term match experience.

The design goal is a game that feels fair, expressive, and replayable from the first match through ranked mastery.
