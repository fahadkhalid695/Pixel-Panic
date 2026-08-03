export type NavigationTarget =
  | 'play'
  | 'create-room'
  | 'ranked'
  | 'party'
  | 'inventory'
  | 'friends'
  | 'leaderboards'
  | 'settings';

export const navigationItems: Array<{ label: string; target: NavigationTarget }> = [
  { label: 'Play', target: 'play' },
  { label: 'Ranked', target: 'ranked' },
  { label: 'Party', target: 'party' },
  { label: 'Inventory', target: 'inventory' },
  { label: 'Friends', target: 'friends' },
  { label: 'Leaderboards', target: 'leaderboards' },
  { label: 'Settings', target: 'settings' }
];
