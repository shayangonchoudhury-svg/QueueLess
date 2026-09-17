/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeLandingView } from './components/HomeLandingView';
import { ServiceDetailView } from './components/ServiceDetailView';
import { DecisionCard } from './components/DecisionCard';
import { Timeline } from './components/Timeline';
import { AlternativeServiceCard } from './components/AlternativeServiceCard';
import { QueueConfirmation } from './components/QueueConfirmation';
import { LiveQueueView } from './components/LiveQueueView';
import { StaffPortalView } from './components/StaffPortalView';
import { MyVisitsView } from './components/MyVisitsView';
import { ServicesCatalogView } from './components/ServicesCatalogView';
import { DemoTestBanner } from './components/DemoTestBanner';
import { CampusService } from './types';
import { Bell, CheckCircle2, Sparkles, X, Code2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedService,
    setSelectedService,
    currentDecision,
    joinQueue,
    activeTicket,
    notification,
    setNotification,
    services,
  } = useApp();

  // Hidden by default for clean user experience & authentic product demo (Section 15)
  const [demoToolbarVisible, setDemoToolbarVisible] = useState(false);

  // Alternative service calculation for Screen 6
  const alternativeService =
    services.find((s) => s.id === 'bonafide-cert') ||
    services.find((s) => s.id !== selectedService.id) ||
    services[1];

  const handleSelectServiceFromHome = (service: CampusService) => {
    setSelectedService(service);
    setActiveView('service_detail');
  };

  const handleCheckForMe = (service: CampusService) => {
    setSelectedService(service);
    setActiveView('service_detail');
  };

  const handleCheckMyVisit = () => {
    setActiveView('decision');
  };

  const handleJoinQueue = () => {
    joinQueue(selectedService);
    setActiveView('queue_confirmation');
  };

  const handleRemindMe = () => {
    setNotification(
      `🔔 Reminder saved! We will notify you at ${currentDecision.recommendedDeparture} (10 mins before departure).`
    );
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeLandingView
            onServiceSelect={handleSelectServiceFromHome}
            onCheckForMe={handleCheckForMe}
          />
        );

      case 'services_catalog':
        return (
          <ServicesCatalogView
            onSelectService={(svc) => {
              setSelectedService(svc);
              setActiveView('service_detail');
            }}
          />
        );

      case 'service_detail':
      case 'requirements':
        return (
          <ServiceDetailView
            onCheckMyVisit={handleCheckMyVisit}
            onBack={() => setActiveView('home')}
          />
        );

      case 'decision':
        return (
          <DecisionCard
            decision={currentDecision}
            service={selectedService}
            onSeeBestTime={() => setActiveView('timeline')}
            onViewQueue={() => setActiveView('live_queue')}
            onSetReminder={() => {
              setNotification(
                `🔔 Reminder scheduled for ${currentDecision.recommendedDeparture}. Queue traffic will be checked again.`
              );
            }}
            onFixRequirement={() => setActiveView('service_detail')}
            onFindAnotherOption={() => setActiveView('alternative')}
            onBackToDetails={() => setActiveView('service_detail')}
          />
        );

      case 'timeline':
        return (
          <Timeline
            decision={currentDecision}
            service={selectedService}
            onJoinQueue={handleJoinQueue}
            onRemindMe={handleRemindMe}
            onBack={() => setActiveView('decision')}
          />
        );

      case 'alternative':
        return (
          <AlternativeServiceCard
            currentService={selectedService}
            alternativeService={alternativeService}
            savingsMinutes={45}
            onSelectAlternative={(altSvc) => {
              setSelectedService(altSvc);
              setActiveView('service_detail');
            }}
            onKeepCurrent={() => setActiveView('decision')}
            onBack={() => setActiveView('decision')}
          />
        );

      case 'queue_confirmation':
        return activeTicket ? (
          <QueueConfirmation
            ticket={activeTicket}
            onViewLiveQueue={() => setActiveView('live_queue')}
            onGoHome={() => setActiveView('home')}
          />
        ) : (
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-600 font-semibold">No active ticket pass.</p>
            <button
              onClick={() => setActiveView('home')}
              className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        );

      case 'live_queue':
        return (
          <LiveQueueView
            onOpenStaffPortal={() => setActiveView('staff_portal')}
            onBackToDashboard={() => setActiveView('home')}
          />
        );

      case 'staff_portal':
        return (
          <StaffPortalView
            onReturnToLiveQueue={() => setActiveView('live_queue')}
            onReturnToDashboard={() => setActiveView('home')}
          />
        );

      case 'my_visits':
        return (
          <MyVisitsView
            onViewLiveQueue={() => setActiveView('live_queue')}
            onExploreServices={() => setActiveView('services_catalog')}
          />
        );

      default:
        return (
          <HomeLandingView
            onServiceSelect={handleSelectServiceFromHome}
            onCheckForMe={handleCheckForMe}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-campus-mesh text-slate-900 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header onOpenDemoToolbar={() => setDemoToolbarVisible((prev) => !prev)} />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {renderActiveView()}
      </main>

      {/* Floating Demo Testing Evaluator Toolbar (Hidden by default for pure user experience) */}
      {demoToolbarVisible && <DemoTestBanner onClose={() => setDemoToolbarVisible(false)} />}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6 mt-12 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">QueueLess</span>
            <span>—</span>
            <span>Don't wait. Know when to go.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Simulated Campus Telemetry</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setDemoToolbarVisible((v) => !v)}
              className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Toggle Dev Scenario Testing Panel"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{demoToolbarVisible ? 'Hide Test Evaluator' : 'Test Evaluator'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
