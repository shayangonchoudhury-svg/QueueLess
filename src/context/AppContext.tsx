import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  CampusService,
  VisitDecision,
  QueueTicket,
  ViewScreen,
  CampusPulseHub,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_USER_DOCUMENTS,
  INITIAL_PULSE_HUBS,
} from '../data/mockData';
import { calculateVisitDecision, formatTo12Hour, addMinutesToTime } from '../utils/decisionEngine';
import { updateMockServiceQueue, updateUserDocument } from '../services/api';

interface AppContextType {
  services: CampusService[];
  selectedService: CampusService;
  setSelectedService: (service: CampusService) => void;
  userDocuments: Record<string, boolean>;
  toggleRequirement: (reqId: string) => void;
  setDocumentState: (reqId: string, state: boolean) => void;
  simulatedTime: string;
  setSimulatedTime: (time24: string) => void;
  currentDecision: VisitDecision;
  recomputeDecision: () => VisitDecision;
  
  // Queue Management
  activeTicket: QueueTicket | null;
  servingToken: number;
  waitingTokens: number[];
  joinQueue: (service?: CampusService) => QueueTicket;
  cancelQueueTicket: () => void;
  staffServeNext: (serviceId?: string) => void;
  
  // Navigation
  activeView: ViewScreen;
  setActiveView: (view: ViewScreen) => void;
  selectServiceAndNavigate: (service: CampusService, targetView?: ViewScreen) => void;
  
  // Campus Pulse & simulation controls
  pulseHubs: CampusPulseHub[];
  updateQueueCount: (serviceId: string, newCount: number) => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  
  // Demo presets for easy testing
  applyDemoPreset: (preset: 'normal_go' | 'missing_photo' | 'crowded_wait' | 'near_closing') => void;
  resetAllToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<CampusService[]>(INITIAL_SERVICES);
  const [selectedService, setSelectedService] = useState<CampusService>(INITIAL_SERVICES[0]);
  const [userDocuments, setUserDocuments] = useState<Record<string, boolean>>({ ...INITIAL_USER_DOCUMENTS });
  const [simulatedTime, setSimulatedTime] = useState<string>('15:20'); // 3:20 PM
  const [activeView, setActiveView] = useState<ViewScreen>('home');
  const [notification, setNotification] = useState<string | null>(null);

  // Queue state (shared between student and staff)
  const [servingToken, setServingToken] = useState<number>(40);
  const [waitingTokens, setWaitingTokens] = useState<number[]>([41, 42, 43, 44, 45, 46, 47]);
  const [activeTicket, setActiveTicket] = useState<QueueTicket | null>(null);
  const [pulseHubs, setPulseHubs] = useState<CampusPulseHub[]>(INITIAL_PULSE_HUBS);

  // Auto-clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Keep selectedService in sync if services list updates
  useEffect(() => {
    const updated = services.find((s) => s.id === selectedService.id);
    if (updated) {
      setSelectedService(updated);
    }
  }, [services, selectedService.id]);

  // Synchronize active ticket with serving token
  useEffect(() => {
    if (activeTicket) {
      if (servingToken === activeTicket.tokenNumber) {
        setActiveTicket((prev) => (prev ? { ...prev, status: 'serving' } : null));
      } else if (servingToken > activeTicket.tokenNumber) {
        setActiveTicket((prev) => (prev ? { ...prev, status: 'completed' } : null));
      }
    }
  }, [servingToken, activeTicket?.tokenNumber]);

  // Decision calculation memoized
  const currentDecision = useMemo(() => {
    return calculateVisitDecision(selectedService, userDocuments, simulatedTime);
  }, [selectedService, userDocuments, simulatedTime]);

  const recomputeDecision = () => {
    return calculateVisitDecision(selectedService, userDocuments, simulatedTime);
  };

  const toggleRequirement = (reqId: string) => {
    setUserDocuments((prev) => {
      const next = { ...prev, [reqId]: !prev[reqId] };
      updateUserDocument(reqId, next[reqId]);
      return next;
    });
  };

  const setDocumentState = (reqId: string, state: boolean) => {
    setUserDocuments((prev) => {
      const next = { ...prev, [reqId]: state };
      updateUserDocument(reqId, state);
      return next;
    });
  };

  const updateQueueCount = (serviceId: string, newCount: number) => {
    const count = Math.max(0, newCount);
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, queueCount: count } : s))
    );
    updateMockServiceQueue(serviceId, count);

    // Update pulse hub as well
    setPulseHubs((prev) =>
      prev.map((hub) => {
        if (
          (serviceId === 'migration-cert' && hub.id === 'hub-admin') ||
          (serviceId === 'bonafide-cert' && hub.id === 'hub-ssc') ||
          (serviceId === 'fee-payment' && hub.id === 'hub-finance')
        ) {
          return {
            ...hub,
            currentWaiting: count,
            estimatedWaitMinutes: Math.round(count * 3.5),
            status: count > 15 ? 'congested' : count > 6 ? 'moderate' : 'optimal',
          };
        }
        return hub;
      })
    );
  };

  const joinQueue = (serviceToJoin?: CampusService): QueueTicket => {
    const targetService = serviceToJoin || selectedService;
    const userTokenNumber = 42; // Canonical user token per prompt
    const curServing = servingToken;
    const peopleAhead = Math.max(0, userTokenNumber - curServing - 1);
    const estWait = Math.max(5, peopleAhead * targetService.averageServiceTimeMinutes);
    const departureTime = addMinutesToTime(simulatedTime, 5);

    const ticket: QueueTicket = {
      ticketId: `QL-${userTokenNumber}`,
      tokenNumber: userTokenNumber,
      serviceId: targetService.id,
      serviceName: targetService.name,
      officeName: targetService.office,
      building: targetService.building,
      issuedAt: formatTo12Hour(simulatedTime),
      initialQueuePosition: peopleAhead,
      currentServingToken: curServing,
      estimatedWaitMinutes: estWait,
      recommendedDeparture: formatTo12Hour(departureTime),
      status: 'waiting',
    };

    // Ensure waiting list includes #42
    setWaitingTokens((prev) => {
      const set = new Set([...prev, userTokenNumber]);
      return Array.from(set).sort((a, b) => a - b);
    });

    setActiveTicket(ticket);
    setNotification(`Token #${userTokenNumber} issued for ${targetService.name}!`);
    return ticket;
  };

  const cancelQueueTicket = () => {
    if (activeTicket) {
      setWaitingTokens((prev) => prev.filter((t) => t !== activeTicket.tokenNumber));
      setActiveTicket(null);
      setNotification('Queue ticket cancelled.');
    }
  };

  const staffServeNext = (serviceId?: string) => {
    setServingToken((prev) => {
      const nextServing = prev + 1;
      setWaitingTokens((currentWaiting) =>
        currentWaiting.filter((tok) => tok !== nextServing)
      );

      // Decrement queueCount on active service
      const targetId = serviceId || selectedService.id;
      setServices((svcList) =>
        svcList.map((svc) =>
          svc.id === targetId ? { ...svc, queueCount: Math.max(0, svc.queueCount - 1) } : svc
        )
      );

      if (activeTicket && nextServing === activeTicket.tokenNumber) {
        setNotification(`🔔 Token #${activeTicket.tokenNumber}: You are now being served!`);
      } else {
        setNotification(`Serving Token #${nextServing} now.`);
      }

      return nextServing;
    });
  };

  const selectServiceAndNavigate = (service: CampusService, targetView: ViewScreen = 'service_detail') => {
    setSelectedService(service);
    setActiveView(targetView);
  };

  // Demo presets for easy 1-click testing
  const applyDemoPreset = (preset: 'normal_go' | 'missing_photo' | 'crowded_wait' | 'near_closing') => {
    const migrationSvc = INITIAL_SERVICES.find((s) => s.id === 'migration-cert') || INITIAL_SERVICES[0];
    
    switch (preset) {
      case 'normal_go':
        setServices(INITIAL_SERVICES);
        setUserDocuments({ ...INITIAL_USER_DOCUMENTS, 'passport-photo': true });
        setSimulatedTime('15:20'); // 3:20 PM
        setSelectedService({ ...migrationSvc, queueCount: 7 });
        setNotification('Applied Preset: Normal Day (All Ready, Queue = 7) → 🟢 GO');
        break;

      case 'missing_photo':
        setUserDocuments({ ...INITIAL_USER_DOCUMENTS, 'passport-photo': false });
        setSelectedService((prev) => ({ ...prev }));
        setNotification('Applied Preset: Missing Passport Photograph → 🔴 DON\'T GO');
        break;

      case 'crowded_wait':
        setUserDocuments({ ...INITIAL_USER_DOCUMENTS, 'passport-photo': true });
        setServices((prev) =>
          prev.map((s) => (s.id === selectedService.id ? { ...s, queueCount: 24 } : s))
        );
        setSelectedService((prev) => ({ ...prev, queueCount: 24 }));
        setNotification('Applied Preset: Heavy Queue (24 people in line > 20) → 🟡 WAIT');
        break;

      case 'near_closing':
        setUserDocuments({ ...INITIAL_USER_DOCUMENTS, 'passport-photo': true });
        setSimulatedTime('16:48'); // 4:48 PM, office closes at 17:00!
        setSelectedService((prev) => ({ ...prev }));
        setNotification('Applied Preset: Late Afternoon (4:48 PM, Closes 5:00 PM) → 🔴 DON\'T GO');
        break;
    }
  };

  const resetAllToDefault = () => {
    setServices(INITIAL_SERVICES);
    setSelectedService(INITIAL_SERVICES[0]);
    setUserDocuments({ ...INITIAL_USER_DOCUMENTS });
    setSimulatedTime('15:20');
    setServingToken(40);
    setWaitingTokens([41, 42, 43, 44, 45, 46, 47]);
    setActiveTicket(null);
    setNotification('Demo reset to initial defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        services,
        selectedService,
        setSelectedService,
        userDocuments,
        toggleRequirement,
        setDocumentState,
        simulatedTime,
        setSimulatedTime,
        currentDecision,
        recomputeDecision,
        activeTicket,
        servingToken,
        waitingTokens,
        joinQueue,
        cancelQueueTicket,
        staffServeNext,
        activeView,
        setActiveView,
        selectServiceAndNavigate,
        pulseHubs,
        updateQueueCount,
        notification,
        setNotification,
        applyDemoPreset,
        resetAllToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
