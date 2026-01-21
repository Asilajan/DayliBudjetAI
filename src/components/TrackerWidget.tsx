import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Transaction } from '../services/api';

interface TrackerWidgetProps {
  transactions: Transaction[];
}

const FRENCH_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const FRENCH_MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function TrackerWidget({ transactions }: TrackerWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const transactionsByDate = new Map<string, number>();
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    if (date.getMonth() === month && date.getFullYear() === year) {
      const dateKey = date.getDate().toString();
      const currentAmount = transactionsByDate.get(dateKey) || 0;
      transactionsByDate.set(dateKey, currentAmount + Math.abs(transaction.amount));
    }
  });

  const amounts = Array.from(transactionsByDate.values());
  const maxAmount = Math.max(...amounts, 1);

  const getIntensityColor = (day: number) => {
    const amount = transactionsByDate.get(day.toString());
    if (!amount) return '#1a1a1a';

    const intensity = amount / maxAmount;
    if (intensity < 0.25) return '#3f3f3f';
    if (intensity < 0.5) return '#5f5f5f';
    if (intensity < 0.75) return '#8f8f8f';
    return '#ffffff';
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const amount = transactionsByDate.get(day.toString());
    days.push(
      <motion.div
        key={day}
        whileHover={{ scale: 1.1 }}
        className="aspect-square rounded-md flex flex-col items-center justify-center cursor-pointer relative group"
        style={{ backgroundColor: getIntensityColor(day) }}
      >
        <span className="text-xs text-[#d1d1d1]">{day}</span>
        {amount && (
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#0a0a0a] border border-[#2f2f2f] rounded px-2 py-1 whitespace-nowrap z-10">
            <span className="text-xs text-white">
              {amount.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} €
            </span>
          </div>
        )}
      </motion.div>
    );
  }

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
          <h2 className="text-white font-medium">Agenda des achats</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#a1a1a1]" />
          </button>
          <span className="text-sm text-white min-w-[100px] text-center">
            {FRENCH_MONTHS[month]} {year}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#a1a1a1]" />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {FRENCH_DAYS.map((day, index) => (
            <div key={index} className="text-center text-xs text-[#6f6f6f] font-medium">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </motion.div>
  );
}
