import { motion } from 'framer-motion';
import { Inbox, Globe, Music, Github, Figma } from 'lucide-react';
import { inboxItems } from '../data/mockData';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Music,
  Github,
  Figma
};

export function InboxWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center gap-2 mb-6">
        <Inbox className="w-5 h-5 text-white" />
        <h2 className="text-white font-medium">Inbox</h2>
      </div>

      <div className="space-y-3">
        {inboxItems.map((item, index) => {
          const Icon = iconMap[item.icon];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              whileHover={{ backgroundColor: '#0f0f0f' }}
              className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1a] rounded-lg">
                  {Icon && <Icon className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="text-sm text-white">{item.name}</div>
                  <div className="text-xs text-[#6f6f6f]">{item.description}</div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  item.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-green-500/10 text-green-500'
                }`}
              >
                {item.status === 'pending' ? 'Pending' : 'Done'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
