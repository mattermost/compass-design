import { Routes, Route } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell/AppShell';
import DocsLayout from '@/components/layout/DocsLayout/DocsLayout';
import Home from '@/pages/home/Home';
import CategoryRoute from '@/pages/topics/CategoryRoute';
import TopicRoute from '@/pages/topics/TopicRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />

        <Route element={<DocsLayout />}>
          <Route path="/:category" element={<CategoryRoute />} />
          <Route path="/:category/:slug" element={<TopicRoute />} />
          <Route
            path="/:category/:slug/specimen"
            element={<TopicRoute />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
