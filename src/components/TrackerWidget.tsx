import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackerData } from '../data/mockData';

export function TrackerWidget() {
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return '#1a1a1a';
      case 1: return '#3f3f3f';
      case 2: return '#7f7f7f';
      default: return '#ffffff';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-white" />
          <h2 className="text-white font-medium">Tracker</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-[#1a1a1a] rounded transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#a1a1a1]" />
          </button>
          <span className="text-sm text-white">January</span>
          <button className="p-1 hover:bg-[#1a1a1a] rounded transition-colors">
            <ChevronRight className="w-4 h-4 text-[#a1a1a1]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {trackerData.map((day) => (
          <motion.div
            key={day.day}
            whileHover={{ scale: 1.1 }}
            className="aspect-square rounded-md flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: getIntensityColor(day.intensity) }}
          >
            <span className="text-xs text-[#7f7f7f]">{day.day}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
