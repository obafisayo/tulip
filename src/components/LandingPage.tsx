import { useState } from 'react';
import { Search, Stethoscope, Users, ArrowRight, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion'; //
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import Vidbox from '../components/icon/vid_box'
import { Screen } from '../lib/types';
import { scrollToTop } from './ScrollToTop';
import PhoneIcon from './icon/phone';
import HeartIcon from './icon/heartIcon';
import LogoIcon from './icon/logo';

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

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

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
      {/* Background Hospital Corridor Image - Subtle Fade In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {/* <img
          src="https://images.unsplash.com/photo-1720180246446-d1738fe8ca76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGNvcnJpZG9yJTIwbW9kZXJufGVufDF8fHx8MTc2NTQ2MTYyNnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hospital"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #29516a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #29516a 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}
        ></div>
      </motion.div>

      {/* Glassmorphic Navigation - Slides Down */}
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon />
            <div>
              <span className="text-2xl text-[#29516a]">Tulip</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="#services" className="text-gray-700 hover:text-[#29516a] transition-colors">Services</a>
            <a href="#staff" className="text-gray-700 hover:text-[#29516a] transition-colors">Our Staff</a>
            <a href="#about" className="text-gray-700 hover:text-[#29516a] transition-colors">About</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2 border text-[#29516a] rounded-full hover:shadow-lg transition-all"
            >
              Enter Portal
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Text Scales Up */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 max-w-7xl mx-auto px-6 py-16"
      >
        <div className="text-center mb-12">
          <motion.h1 variants={fadeInUp} className="text-6xl font-bold mb-4 text-[#29516a]">
            Welcome to Tulip
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-700 mb-8">
            Your Advanced Digital Healthcare Facility • Open 24/7
          </motion.p>

          {/* Search Reception Desk - Pop In Effect */}
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-2xl"
          >
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
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#1f3e52" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearchSubmit}
                className="px-8 py-3 bg-[#29516a] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Search size={20} />
                Submit
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Hospital Departments/Pathways - Staggered Scroll Animation */}
        <motion.div
          id="services"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-3 gap-6 mb-16"
        >
          {/* Card 1 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('dashboard')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <HeartIcon />
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">Diagnosis Wing</h3>
                <p className="text-gray-600 mb-3">Submit symptoms and receive instant AI analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#29516a] group-hover:gap-3 transition-all">
              <MapPin size={16} />
              <span className="text-sm">Main Corridor, Left Wing</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('video')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <Vidbox />
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">Consultation Wing</h3>
                <p className="text-gray-600 mb-3">Connect with AI doctors face-to-face</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#29516a] group-hover:gap-3 transition-all">
              <MapPin size={16} />
              <span className="text-sm">Second Floor, Room 201</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('voice')}
            className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl cursor-pointer group hover:bg-white/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <PhoneIcon />
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-[#29516a]">Nurse Triage Wing</h3>
                <p className="text-gray-600 mb-3">Immediate voice triage with nurses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-600 group-hover:gap-3 transition-all">
              <Clock size={16} />
              <span className="text-sm">Available 24/7</span>
              <ArrowRight size={16} className="ml-auto" />
            </div>
          </motion.div>
        </motion.div>

        {/* Available Staff - Nurses Station - Staggered Scroll Animation */}
        <motion.div
          id="staff"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-[#29516a]" size={32} />
            <div>
              <h2 className="text-3xl text-[#29516a]">Nurses Station</h2>
              <p className="text-gray-600">Connect with our available medical staff</p>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6"
          >
            {nurses.map((nurse, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                onClick={() => onNavigate('voice')}
                className="bg-white/50 p-6 rounded-2xl border border-white/40 shadow-lg cursor-pointer group hover:bg-white/60"
              >
                <div className="relative mb-4">
                  <img
                    src={nurse.image}
                    alt={nurse.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform"
                  />
                </div>
                <h4 className="text-xl text-center mb-1 text-[#29516a]">{nurse.name}</h4>
                <p className="text-sm text-gray-600 text-center mb-2">{nurse.specialty}</p>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{nurse.availability}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#29516a", color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 py-2 text-[#29516a] border border-[#29516a] rounded-xl transition-all"
                >
                  Connect Now
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hospital Info Footer - Pop In */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-3 gap-6"
        >
          {[
            { Icon: Clock, title: "24/7 Service", text: "Always here when you need us" },
            { Icon: Stethoscope, title: "AI-Powered Care", text: "Advanced diagnosis technology" },
            { Icon: Users, title: "Expert Verification", text: "Human specialist audits available" }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl border border-white/20 text-center"
            >
              <item.Icon className="text-[#29516a] mx-auto mb-3" size={32} />
              <h4 className="mb-2 text-[#29516a]">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}