import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { Dashboard } from './pages/Dashboard';
import { SessionSelection } from './pages/SessionSelection';
import { SessionDocumentation } from './pages/SessionDocumentation';
import { GroupSession } from './pages/GroupSession';
import { BulkEntry } from './pages/BulkEntry';
import { ReviewSubmission } from './pages/ReviewSubmission';
import { SubmittedNote } from './pages/SubmittedNote';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50/80 relative overflow-x-hidden flex flex-col selection:bg-teal-100 selection:text-teal-900 font-sans">
        {/* Responsive Animated Background Theme */}
        <AnimatedBackground />

        {/* Global Product Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<SessionSelection />} />
            <Route path="/sessions/:id" element={<SessionDocumentation />} />
            <Route path="/group/:id" element={<GroupSession />} />
            <Route path="/bulk" element={<BulkEntry />} />
            <Route path="/review/:id" element={<ReviewSubmission />} />
            <Route path="/submitted/:id" element={<SubmittedNote />} />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
