import { Outlet } from 'react-router-dom';
import TopNav from '@/components/layout/TopNav/TopNav';
import QuickSwitcher from '@/components/layout/QuickSwitcher';
import { useState } from 'react';
import styles from './AppShell.module.scss';

export default function AppShell() {
  const isEmbedded = window.self !== window.top;
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);

  return (
    <div className={styles['app-shell']}>
      {!isEmbedded && (
        <TopNav onOpenQuickSwitcher={() => setQuickSwitcherOpen(true)} />
      )}
      {!isEmbedded && (
        <QuickSwitcher open={quickSwitcherOpen} onOpenChange={setQuickSwitcherOpen} />
      )}
      <div className={styles['app-shell__content']}>
        <Outlet />
      </div>
    </div>
  );
}
