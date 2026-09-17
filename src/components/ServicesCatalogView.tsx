import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { CampusService } from '../types';
import { Search, Filter, Sparkles, Building, ChevronRight } from 'lucide-react';

interface ServicesCatalogViewProps {
  onSelectService: (service: CampusService) => void;
}

export const ServicesCatalogView: React.FC<ServicesCatalogViewProps> = ({
  onSelectService,
}) => {
  const { services, selectServiceAndNavigate } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'academic', label: 'Academic Administration' },
    { id: 'student_services', label: 'Student Services' },
    { id: 'finance', label: 'Finance & Accounts' },
    { id: 'records', label: 'Registrar & Records' },
  ];

  const filteredServices = services.filter((svc) => {
    const matchesCategory =
      filterCategory === 'all' || svc.category === filterCategory;
    const matchesSearch =
      svc.name.toLowerCase().includes(search.toLowerCase()) ||
      svc.office.toLowerCase().includes(search.toLowerCase()) ||
      svc.building.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block">
            CAMPUS VISIT DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
            Campus Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Check real-time counter traffic, service requirements, and departure advice for all campus counters.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service or office..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={onSelectService}
            onCheckForMe={onSelectService}
          />
        ))}
      </div>
    </div>
  );
};
