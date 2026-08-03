import './main-menu.css';

type MainMenuProps = {
  onNavigate: (screen: 'play' | 'create-room' | 'ranked' | 'party' | 'inventory' | 'friends' | 'leaderboards' | 'settings') => void;
};

const featuredStats = [
  { label: 'Rank', value: 'Nova III' },
  { label: 'Queue', value: 'Arena Clash' },
  { label: 'Party', value: 'Solo Ready' }
];

const navigationItems = [
  { label: 'Play', screen: 'play' as const },
  { label: 'Ranked', screen: 'ranked' as const },
  { label: 'Party', screen: 'party' as const },
  { label: 'Inventory', screen: 'inventory' as const },
  { label: 'Friends', screen: 'friends' as const },
  { label: 'Leaderboards', screen: 'leaderboards' as const },
  { label: 'Settings', screen: 'settings' as const }
];

export function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <main className="main-menu-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Pixel Panic</p>
          <h1 className="title">Arcade chaos. Competitive precision.</h1>
          <p className="description">
            Jump into fast multiplayer arena matches with bombs, ice, hazards, and
            high-stakes movement control.
          </p>
        </div>

        <div className="hero-stats" aria-label="Player summary">
          {featuredStats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </article>
          ))}
        </div>

        <div className="action-row">
          <button className="primary-action" type="button" onClick={() => onNavigate('play')}>
            Play Now
          </button>
          <button className="secondary-action" type="button" onClick={() => onNavigate('create-room')}>
            Create Room
          </button>
        </div>
      </section>

      <aside className="menu-panel" aria-label="Main navigation">
        <div className="menu-header">
          <span className="menu-title">Menu</span>
          <span className="menu-status">Online</span>
        </div>

        <nav className="menu-grid">
          {navigationItems.map((item) => (
            <button key={item.label} className="menu-button" type="button" onClick={() => onNavigate(item.screen)}>
              {item.label}
            </button>
          ))}
        </nav>

        <section className="news-panel" aria-label="Featured update">
          <span className="news-kicker">Seasonal Event</span>
          <strong className="news-title">Frozen Circuit live now</strong>
          <p className="news-copy">
            New winter map variants, limited cosmetics, and a fresh ranked rotation.
          </p>
        </section>
      </aside>
    </main>
  );
}
