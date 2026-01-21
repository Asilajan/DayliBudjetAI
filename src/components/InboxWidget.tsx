import { motion } from 'framer-motion';
import { Inbox, Plus, Trash2, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getEmailAccounts, addEmailAccount, deleteEmailAccount, toggleEmailAccount, type EmailAccount } from '../services/localStorage';

export function InboxWidget() {
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadEmails();
  }, []);

  async function loadEmails() {
    const emailsData = await getEmailAccounts();
    setEmails(emailsData);
  }

  async function handleAddEmail() {
    if (newEmail.trim() && newName.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        alert('Veuillez entrer une adresse email valide');
        return;
      }

      const success = await addEmailAccount(newEmail.trim(), newName.trim());
      if (success) {
        await loadEmails();
        setNewEmail('');
        setNewName('');
        setIsAddingEmail(false);
      } else {
        alert('Cette adresse email existe déjà');
      }
    }
  }

  async function handleDeleteEmail(id: string | number) {
    const success = await deleteEmailAccount(String(id));
    if (success) {
      await loadEmails();
    }
  }

  async function handleToggleEmail(id: string | number, currentStatus: boolean) {
    const success = await toggleEmailAccount(String(id), !currentStatus);
    if (success) {
      await loadEmails();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-white" />
          <h2 className="text-white font-medium">Boîte de réception</h2>
        </div>
        <button
          onClick={() => setIsAddingEmail(true)}
          className="flex items-center gap-1 px-3 py-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" />
          Ajouter
        </button>
      </div>

      {isAddingEmail && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-[#0a0a0a] border border-[#2f2f2f] rounded-lg"
        >
          <input
            type="text"
            placeholder="Nom (ex: Personnel, Travail)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full mb-2 bg-[#1a1a1a] border border-[#2f2f2f] rounded px-3 py-2 text-sm text-white placeholder-[#6f6f6f] focus:outline-none focus:border-[#3b82f6]"
          />
          <input
            type="email"
            placeholder="Adresse email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full mb-3 bg-[#1a1a1a] border border-[#2f2f2f] rounded px-3 py-2 text-sm text-white placeholder-[#6f6f6f] focus:outline-none focus:border-[#3b82f6]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddEmail}
              className="flex-1 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm rounded transition-colors"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setIsAddingEmail(false);
                setNewEmail('');
                setNewName('');
              }}
              className="flex-1 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-sm rounded transition-colors"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {emails.length === 0 ? (
          <div className="text-center py-8 text-[#6f6f6f] text-sm">
            Aucune adresse email configurée
          </div>
        ) : (
          emails.map((email, index) => {
            const emailId = email.Id || email.id;
            return (
              <motion.div
                key={emailId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#0f0f0f] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${email.is_active ? 'bg-[#3b82f6]/20' : 'bg-[#1a1a1a]'}`}>
                    <Mail className={`w-4 h-4 ${email.is_active ? 'text-[#3b82f6]' : 'text-[#6f6f6f]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{email.name}</div>
                    <div className="text-xs text-[#6f6f6f] truncate">{email.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEmail(emailId!, email.is_active)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      email.is_active
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-[#1a1a1a] text-[#6f6f6f] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {email.is_active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleDeleteEmail(emailId!)}
                    className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
