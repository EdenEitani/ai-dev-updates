interface HeaderProps {
  newCount: number
}

export function Header({ newCount }: HeaderProps) {
  async function requestNotifications() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted' && newCount > 0) {
      new Notification('AI Dev Updates', {
        body: `${newCount} new item${newCount !== 1 ? 's' : ''} since your last visit`,
        icon: '/icon.svg',
      })
    }
  }

  const notifGranted = 'Notification' in window && Notification.permission === 'granted'
  const showBell = 'Notification' in window && Notification.permission !== 'denied'

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="header-icon">AI</span>
          <span className="header-title">Dev Updates</span>
        </div>
        <p className="header-sub">
          AI tools, releases &amp; research — updated hourly
        </p>
        {showBell && (
          <button
            className={`notif-bell${notifGranted ? ' notif-bell--on' : ''}`}
            onClick={requestNotifications}
            title={notifGranted ? 'Notifications enabled' : 'Enable notifications'}
            aria-label="Enable notifications"
          >
            {notifGranted ? '🔔' : '🔕'}
            {newCount > 0 && (
              <span className="notif-badge">{newCount > 99 ? '99+' : newCount}</span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
