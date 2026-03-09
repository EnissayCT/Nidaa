import { useState } from 'react';
import { MapPin, Phone, Clock, Star, AlertTriangle, Navigation, Search, Filter } from 'lucide-react';
import clsx from 'clsx';
import { hospitals } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

export default function DonorNearby() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const filtered = hospitals
    .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'distance' ? a.distance - b.distance : b.rating - a.rating);

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="card overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={40} className="text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Interactive Map</p>
            <p className="text-xs text-gray-400">Huawei Maps integration — available in production</p>
          </div>
          {/* Fake map dots */}
          {hospitals.slice(0, 4).map((h, i) => (
            <div
              key={h.id}
              className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse"
              style={{
                top: `${25 + (i * 15) + (i % 2) * 10}%`,
                left: `${20 + (i * 18)}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-100">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals or cities..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {['distance', 'rating'].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={clsx(
                'px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors',
                sortBy === s ? 'bg-red-600 text-white' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
              )}
            >
              {s === 'distance' ? '📍 Nearest' : '⭐ Top Rated'}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="space-y-3">
        {filtered.map((hospital) => (
          <div key={hospital.id} className="card-hover p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{hospital.city} · {hospital.region}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Navigation size={12} className="text-red-400" />
                      {hospital.distance} km away
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star size={12} className="text-amber-400" />
                      {hospital.rating}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      ~{hospital.waitTime} wait
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={12} />
                      {hospital.phone}
                    </span>
                  </div>

                  {hospital.urgentNeeds.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <AlertTriangle size={12} className="text-amber-500" />
                      <span className="text-xs font-medium text-amber-700">Urgent needs:</span>
                      <div className="flex gap-1">
                        {hospital.urgentNeeds.map((t) => (
                          <BloodTypeBadge key={t} type={t} size="sm" urgency="critical" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2">
                <button className="btn-primary text-xs py-2 px-4">
                  Book Appointment
                </button>
                <button className="btn-secondary text-xs py-2 px-4">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
