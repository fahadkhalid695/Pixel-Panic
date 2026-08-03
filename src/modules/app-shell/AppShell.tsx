import { useState } from 'react';
import { MainMenu } from '@/modules/main-menu/MainMenu';
import type { NavigationTarget } from '@/modules/navigation/navigation';
import './app-shell.css';

type ShellScreen =
  | 'menu'
  | NavigationTarget
  | 'create-room';

const screenCopy: Record<Exclude<ShellScreen, 'menu'>, { title: string; body: string }> = {
  play: {
    title: 'Play Queue',
    body: 'This shell is ready for the matchmaking and lobby flow to be implemented next.'
  },
  'create-room': {
    title: 'Create Room',
    body: 'Private room creation will mount here with host controls, invite code, and settings.'
  },
  ranked: {
    title: 'Ranked',
    body: 'Ranked queue, leagues, and seasonal progression will plug into this screen.'
  },
  party: {
    title: 'Party',
    body: 'Party management, invites, and presence will live here as the social layer expands.'
  },
  inventory: {
    title: 'Inventory',
    body: 'Cosmetics, loadouts, and item preview will be implemented in this module.'
  },
  friends: {
    title: 'Friends',
    body: 'Friend list, requests, and quick invite actions will mount here.'
  },
  leaderboards: {
    title: 'Leaderboards',
    body: 'Ranked boards, seasonal standings, and friends comparisons will appear here.'
  },
  settings: {
    title: 'Settings',
    body: 'Audio, controls, accessibility, and gameplay preferences will be added here.'
  }
};

export function AppShell() {
  const [screen, setScreen] = useState<ShellScreen>('menu');

  if (screen === 'menu') {
    return <MainMenu onNavigate={setScreen} />;
  }

  const activeScreen = screenCopy[screen];

  return (
    <main className="shell-stage">
      <section className="shell-card" aria-labelledby="screen-title">
        <p className="shell-kicker">Pixel Panic</p>
        <h1 id="screen-title" className="shell-title">
          {activeScreen.title}
        </h1>
        <p className="shell-copy">{activeScreen.body}</p>

        <div className="shell-actions">
          <button className="shell-primary" type="button" onClick={() => setScreen('menu')}>
            Back to Menu
          </button>
        </div>
      </section>
    </main>
  );
}
