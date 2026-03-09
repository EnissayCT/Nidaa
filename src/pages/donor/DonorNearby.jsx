import { useState, useRef } from 'react';
import { MapPin, Phone, Clock, Star, AlertTriangle, Navigation, Search, Filter, X, Calendar, CheckCircle2, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import clsx from 'clsx';
import { hospitals } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

// Fix Leaflet default marker icons (Vite bundling issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom red marker for hospitals
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Hospital coordinates across Morocco
const hospitalCoords = {
  1: [33.9916, -6.8498],   // CHU Ibn Sina — Rabat
  2: [33.5731, -7.5898],   // CHU Ibn Rochd — Casablanca
  3: [34.0331, -5.0003],   // CHU Hassan II — Fès
  4: [31.6295, -7.9811],   // CHU Mohammed VI — Marrakech
  5: [33.9850, -6.8684],   // Hôpital Cheikh Zaïd — Rabat
  6: [33.9975, -6.8377],   // Centre Régional de Transfusion — Rabat
  7: [34.0048, -6.8326],   // Hôpital Militaire Mohammed V — Rabat
  8: [33.5950, -7.6187],   // Centre de Transfusion Sanguine — Casablanca
  9: [33.5572, -7.6330],   // Clinique Dar Salam — Casablanca
  10: [34.6814, -1.9086],  // CHU Mohammed VI — Oujda
  11: [33.5890, -7.6030],  // Hôpital Moulay Youssef — Casablanca
  12: [35.7595, -5.8340],  // CHU Mohammed VI — Tanger
  13: [33.5670, -7.5750],  // Centre Régional de Transfusion — Casablanca
  14: [30.4278, -9.5981],  // Hôpital Hassan II — Agadir
  15: [31.6340, -8.0100],  // Clinique Internationale — Marrakech
  16: [33.0017, -7.6167],  // CHU Hassan II — Settat
  17: [33.8945, -5.5473],  // Centre de Transfusion Sanguine — Meknès
  18: [34.2610, -6.5802],  // Hôpital Régional — Kénitra
};

// Morocco center (shows all hospitals)
const CASABLANCA_CENTER = [33.2, -7.0];

// Time slots for appointment
const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export default function DonorNearby() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [bookingHospital, setBookingHospital] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0=form, 1=confirming, 2=confirmed
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [donationType, setDonationType] = useState('Whole Blood');
  const mapRef = useRef(null);

  const filtered = hospitals
    .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'distance' ? a.distance - b.distance : b.rating - a.rating);

  const openBooking = (hospital) => {
    setBookingHospital(hospital);
    setBookingStep(0);
    setSelectedDate('');
    setSelectedTime('');
    setDonationType('Whole Blood');
  };

  const confirmBooking = () => {
    setBookingStep(1);
    setTimeout(() => setBookingStep(2), 1500);
  };

  const flyTo = (hospitalId) => {
    const coords = hospitalCoords[hospitalId];
    if (coords && mapRef.current) {
      mapRef.current.flyTo(coords, 14, { duration: 1.2 });
    }
  };

  // Generate next 14 available dates
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sunday
    return d.toISOString().split('T')[0];
  }).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Interactive Map */}
      <div className="card overflow-hidden">
        <div className="relative" style={{ height: 360 }}>
          <MapContainer
            center={CASABLANCA_CENTER}
            zoom={6}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hospitals.map((h) => {
              const coords = hospitalCoords[h.id];
              if (!coords) return null;
              return (
                <Marker key={h.id} position={coords} icon={redIcon}>
                  <Popup>
                    <div className="text-sm min-w-[180px]">
                      <p className="font-bold text-gray-900">{h.name}</p>
                      <p className="text-gray-500 text-xs">{h.city} · {h.rating} ⭐</p>
                      {h.urgentNeeds.length > 0 && (
                        <p className="text-red-600 text-xs mt-1 font-medium">⚠️ Urgent: {h.urgentNeeds.join(', ')}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Wait: ~{h.waitTime} · {h.distance} km</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
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
                <button onClick={() => openBooking(hospital)} className="btn-primary text-xs py-2 px-4">
                  Book Appointment
                </button>
                <button onClick={() => flyTo(hospital.id)} className="btn-secondary text-xs py-2 px-4">
                  Show on Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setBookingHospital(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-500">{bookingHospital.name}</p>
              </div>
              <button onClick={() => setBookingHospital(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="p-5">
              {/* Step 0: Form */}
              {bookingStep === 0 && (
                <div className="space-y-5">
                  {/* Donation Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Donation Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Whole Blood', 'Platelets', 'Plasma', 'Double Red Cell'].map((dt) => (
                        <button
                          key={dt}
                          onClick={() => setDonationType(dt)}
                          className={clsx(
                            'px-3 py-2 rounded-xl text-sm font-medium transition-colors border',
                            donationType === dt
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          {dt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      <Calendar size={14} className="inline mr-1" />
                      Select Date
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {availableDates.map((d) => {
                        const dt = new Date(d);
                        return (
                          <button
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={clsx(
                              'p-2 rounded-lg text-center transition-colors border',
                              selectedDate === d
                                ? 'bg-red-600 text-white border-red-600'
                                : 'border-gray-100 hover:bg-gray-50'
                            )}
                          >
                            <p className="text-[10px] uppercase">{dt.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-sm font-semibold">{dt.getDate()}</p>
                            <p className="text-[10px]">{dt.toLocaleDateString('en-US', { month: 'short' })}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time */}
                  {selectedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        <Clock size={14} className="inline mr-1" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {TIME_SLOTS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={clsx(
                              'px-2 py-2 rounded-lg text-sm font-medium transition-colors border',
                              selectedTime === t
                                ? 'bg-red-600 text-white border-red-600'
                                : 'border-gray-100 hover:bg-gray-50'
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={confirmBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full btn-primary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm Appointment
                  </button>
                </div>
              )}

              {/* Step 1: Processing */}
              {bookingStep === 1 && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 mx-auto rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
                  <p className="text-sm text-gray-500 mt-4">Confirming your appointment...</p>
                </div>
              )}

              {/* Step 2: Confirmed */}
              {bookingStep === 2 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Appointment Confirmed!</h4>
                    <p className="text-sm text-gray-500 mt-1">Your appointment has been scheduled</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hospital</span>
                      <span className="font-medium text-gray-900">{bookingHospital.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium text-gray-900">{donationType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium text-gray-900">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Confirmation</span>
                      <span className="font-medium text-emerald-600">APT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 text-left">
                    <p className="text-xs text-amber-700 font-medium">📋 Reminders</p>
                    <ul className="text-xs text-amber-600 mt-1 space-y-0.5 list-disc list-inside">
                      <li>Drink plenty of water beforehand</li>
                      <li>Eat a healthy meal 2-3 hours before</li>
                      <li>Bring a valid ID and your donor card</li>
                      <li>Wear a shirt with loose sleeves</li>
                    </ul>
                  </div>

                  <button onClick={() => setBookingHospital(null)} className="w-full btn-primary py-3 text-sm">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
