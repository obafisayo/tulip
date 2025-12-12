import { useState } from 'react';
import { Search, Stethoscope, Users, Video, Phone, ArrowRight, Clock, MapPin } from 'lucide-react';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import Vidbox from '../components/icon/vid_box'
import { Screen } from '../lib/types';
import { scrollToTop } from './ScrollToTop';

interface LandingPageProps {
  onNavigate: (screen: Screen, symptoms?: string) => void;
}

const nurses = [
  {
    name: 'Adetola Ajayi',
    specialty: 'Triage Specialist',
    availability: 'Available Now',
    image: img1
  },
  {
    name: 'Daramola Omogbolaga',
    specialty: 'Emergency Care',
    availability: 'On Duty',
    image: img2
  },
  {
    name: 'Ogunade Toheeb',
    specialty: 'Patient Care',
    availability: 'Available Now',
    image: img3
  }
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [searchInput, setSearchInput] = useState('');
  scrollToTop();

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      onNavigate('dashboard', searchInput);
    } else {
      onNavigate('dashboard');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background Hospital Corridor Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1720180246446-d1738fe8ca76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGNvcnJpZG9yJTIwbW9kZXJufGVufDF8fHx8MTc2NTQ2MTYyNnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hospital"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Glassmorphic Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white text-2xl">🌷</span>
            <div>
              <span className="text-2xl text-[#29516a]">Tulip</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="#services" className="text-gray-700 hover:text-[#29516a] transition-colors">Services</a>
            <a href="#staff" className="text-gray-700 hover:text-[#29516a] transition-colors">Our Staff</a>
            <a href="#about" className="text-gray-700 hover:text-[#29516a] transition-colors">About</a>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2 border text-[#29516a] rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              Enter Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Hospital Entrance */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-[#29516a]">
            Welcome to Tulip
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your Advanced Digital Healthcare Facility • Open 24/7
          </p>

          {/* Search Reception Desk */}
          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-2xl">
            <h3 className="text-2xl mb-4 text-[#29516a]">Reception Desk</h3>
            <p className="text-gray-600 mb-6">How can we help you today?</p>
            <div className="flex gap-3 p-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Describe your symptoms or what you need..."
                className="flex-1 px-6 bg-transparent outline-none text-gray-800 placeholder:text-gray-500"
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={handleSearchSubmit}
                className="px-8 py-3 bg-[#29516a] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Search size={20} />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Hospital Departments/Pathways */}
        <div id="services" className="grid grid-cols-3 gap-6 mb-16">
          {/* AI Diagnosis Wing */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#29516a] to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Stethoscope className="text-white" size={28} />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">AI Diagnosis Wing</h3>
                <p className="text-gray-600 mb-3">Submit symptoms and receive instant AI analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#29516a] group-hover:gap-3 transition-all">
              <MapPin size={16} />
              <span className="text-sm">Main Corridor, Left Wing</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </div>

          {/* Video Consultation Rooms */}
          <div
            onClick={() => onNavigate('video')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <Vidbox />
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">Video Consultation</h3>
                <p className="text-gray-600 mb-3">Connect with AI doctors face-to-face</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#29516a] group-hover:gap-3 transition-all">
              <MapPin size={16} />
              <span className="text-sm">Second Floor, Room 201</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </div>

          {/* Emergency Voice Line */}
          <div
            onClick={() => onNavigate('voice')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">Emergency Line</h3>
                <p className="text-gray-600 mb-3">Immediate voice triage with nurses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-600 group-hover:gap-3 transition-all">
              <Clock size={16} />
              <span className="text-sm">Available 24/7</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </div>
        </div>

        {/* Available Staff - Nurses Station */}
        <div id="staff" className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl border border-white/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-[#29516a]" size={32} />
            <div>
              <h2 className="text-3xl text-[#29516a]">Nurses Station</h2>
              <p className="text-gray-600">Connect with our available medical staff</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {nurses.map((nurse, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('voice')}
                className="bg-white/50 p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:bg-white/60"
              >
                <div className="relative mb-4">
                  <img
                    src={nurse.image}
                    alt={nurse.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                </div>
                <h4 className="text-xl text-center mb-1 text-[#29516a]">{nurse.name}</h4>
                <p className="text-sm text-gray-600 text-center mb-2">{nurse.specialty}</p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{nurse.availability}</span>
                </div>
                <button
                  className="w-full mt-4 py-2 text-[#29516a] border hover:bg-[#29516a] border-[#29516a] hover:text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Connect Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Info Footer */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 text-center">
            <Clock className="text-[#29516a] mx-auto mb-3" size={32} />
            <h4 className="mb-2 text-[#29516a]">24/7 Service</h4>
            <p className="text-sm text-gray-600">Always here when you need us</p>
          </div>
          <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 text-center">
            <Stethoscope className="text-[#29516a] mx-auto mb-3" size={32} />
            <h4 className="mb-2 text-[#29516a]">AI-Powered Care</h4>
            <p className="text-sm text-gray-600">Advanced diagnosis technology</p>
          </div>
          <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 text-center">
            <Users className="text-[#29516a] mx-auto mb-3" size={32} />
            <h4 className="mb-2 text-[#29516a]">Expert Verification</h4>
            <p className="text-sm text-gray-600">Human specialist audits available</p>
          </div>
        </div>
      </div>
    </div>
  );
}