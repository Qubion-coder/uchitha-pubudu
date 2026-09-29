import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Sparkles, User, Link as LinkIcon, ArrowLeft, MessageCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

const PREFIXES = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Mr. & Mrs.', label: 'Mr. & Mrs.' },
  { value: 'Family', label: 'Family' },
  { value: 'Dear', label: 'Dear' },
];

const GROOM_NAME = 'Pubudu';
const BRIDE_NAME = 'Kusheli';

/**
 * Build the display name from prefix + guest name.
 * 
 * | Prefix       | Guest Name | Display Name       |
 * |--------------|------------|--------------------|
 * | Mr.          | Sanjaya    | Mr. Sanjaya        |
 * | Mrs.         | Sanduni    | Mrs. Sanduni       |
 * | Miss         | Sanduni    | Miss Sanduni       |
 * | Mr. & Mrs.   | Perera     | Mr. & Mrs. Perera  |
 * | Family       | Sanjaya    | Sanjaya and Family |
 * | Dear         | Sanjaya    | Sanjaya            |
 */
function buildDisplayName(prefix: string, name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) return '';

  switch (prefix) {
    case 'Family':
      return `${trimmedName} and Family`;
    case 'Dear':
      // "Dear" is handled in the greeting; display name is just the name
      return trimmedName;
    default:
      return prefix ? `${prefix} ${trimmedName}` : trimmedName;
  }
}

/**
 * Build the greeting line.
 * For "Dear" prefix, the message template already starts with "Dear",
 * so we just use the name to avoid "Dear Dear Sanjaya".
 */
function buildGreeting(prefix: string, name: string): string {
  const displayName = buildDisplayName(prefix, name);
  return `Dear ${displayName} ❤️`;
}

function buildFullMessage(prefix: string, name: string, link: string): string {
  const greeting = buildGreeting(prefix, name);

  return `${greeting}

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

function buildInvitationUrl(prefix: string, name: string): string {
  const baseUrl = window.location.origin;
  const displayName = buildDisplayName(prefix, name);
  // URL-encode the display name
  const encoded = encodeURIComponent(displayName);
  return `${baseUrl}/?title=${prefix === 'Dear' ? '' : prefix === 'Family' ? '' : encodeURIComponent(prefix)}&name=${prefix === 'Family' ? encodeURIComponent(name.trim() + ' and Family') : encodeURIComponent(name.trim())}`;
}

export const Admin: React.FC = () => {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const displayName = buildDisplayName(prefix, guestName);
  const greeting = guestName.trim() ? buildGreeting(prefix, guestName) : '';

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Please enter a guest name');
      return;
    }

    const url = buildInvitationUrl(prefix, guestName);
    setGeneratedUrl(url);
    setCopiedLink(false);
    setCopiedMessage(false);
    toast.success('Invitation link generated!');
  };

  const handleCopyLink = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopiedLink(true);
      toast.success('Link copied!');
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  };

  const handleCopyMessage = () => {
    if (!generatedUrl) return;
    const message = buildFullMessage(prefix, guestName, generatedUrl);
    navigator.clipboard.writeText(message).then(() => {
      setCopiedMessage(true);
      toast.success('Full message copied!');
      setTimeout(() => setCopiedMessage(false), 3000);
    }).catch(() => {
      toast.error('Failed to copy message.');
    });
  };

  return (
    <div className="min-h-screen bg-brand-blush py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 relative overflow-hidden selection:bg-brand-plum/20">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-radial from-brand-lavender/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-brand-rose/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="mb-8 flex justify-between items-center">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-brand-lavender/40 text-stone-600 hover:text-brand-plum hover:bg-white transition-all shadow-sm font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Invitation
          </a>
          <span className="px-4 py-1.5 rounded-full bg-brand-rose border border-brand-lavender/30 text-brand-plum text-xs font-bold uppercase tracking-widest shadow-sm">
            Admin
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
            <span className="text-brand-plum uppercase tracking-[0.5em] text-xs font-bold drop-shadow-sm">Link Generator</span>
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-stone-800 tracking-tight mb-3 drop-shadow-sm">
            Invitation <span className="italic font-light text-brand-plum">Generator</span>
          </h1>
          <p className="text-stone-500 font-serif italic text-base sm:text-lg max-w-xl mx-auto">
            Generate personalized invitation links and WhatsApp messages for your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ─── Form Card ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white/80 backdrop-blur-2xl p-7 sm:p-9 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(176,137,104,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-rose via-brand-plum to-brand-rose" />

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Prefix */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-2.5 flex items-center gap-2 ml-1">
                  <User className="w-3.5 h-3.5 text-brand-plum" />
                  Select Prefix
                </label>
                <select
                  value={prefix}
                  onChange={(e) => { setPrefix(e.target.value); setGeneratedUrl(''); }}
                  className="w-full bg-white px-5 py-3.5 rounded-2xl border border-stone-200/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif text-base shadow-inner text-stone-800 cursor-pointer"
                >
                  {PREFIXES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-2.5 flex items-center gap-2 ml-1">
                  <User className="w-3.5 h-3.5 text-brand-plum" />
                  Guest Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanjaya"
                  value={guestName}
                  onChange={(e) => { setGuestName(e.target.value); setGeneratedUrl(''); }}
                  className="w-full bg-white px-5 py-3.5 rounded-2xl border border-stone-200/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif italic text-base shadow-inner text-stone-800 placeholder:text-stone-400"
                />
              </div>

              {/* Live Preview */}
              <AnimatePresence>
                {guestName.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-plum mb-2 flex items-center gap-1.5">
                        <Eye className="w-3 h-3" /> Live Preview
                      </p>
                      <p className="text-sm text-stone-700 font-serif">
                        Display name: <span className="font-semibold text-stone-900">{displayName}</span>
                      </p>
                      <p className="text-sm text-stone-600 font-serif mt-1 italic">
                        {greeting}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate Button */}
              <button
                type="submit"
                className="w-full bg-stone-800 text-brand-rose py-4 rounded-full font-sans tracking-[0.25em] font-bold text-[11px] uppercase hover:bg-stone-900 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <LinkIcon className="w-4 h-4 text-brand-plum" />
                Generate Link
              </button>
            </form>
          </motion.div>

          {/* ─── Result Card ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/80 backdrop-blur-2xl p-7 sm:p-9 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(176,137,104,0.15)] relative overflow-hidden h-full">
              <h3 className="font-serif text-xl text-stone-800 mb-5 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-plum" />
                Generated Invitation
              </h3>

              <AnimatePresence mode="wait">
                {generatedUrl ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    {/* Link display */}
                    <div className="p-4 bg-brand-rose/40 rounded-2xl border border-brand-lavender/30">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-plum mb-2 flex items-center gap-1.5">
                        <LinkIcon className="w-3 h-3" /> Invitation Link
                      </p>
                      <a
                        href={generatedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-stone-700 font-mono break-all hover:text-brand-plum transition-colors inline-flex items-start gap-1.5"
                      >
                        {generatedUrl}
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      </a>
                    </div>

                    {/* Message Preview */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-plum mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> WhatsApp Message Preview
                      </p>
                      <div className="text-[13px] text-stone-700 font-serif whitespace-pre-wrap leading-relaxed bg-white/70 p-4 rounded-xl border border-stone-100 max-h-64 overflow-y-auto">
                        {buildFullMessage(prefix, guestName, generatedUrl)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleCopyLink}
                        className="flex-1 bg-brand-plum text-white py-3.5 px-5 rounded-full font-sans tracking-[0.15em] font-bold text-[11px] uppercase hover:bg-brand-plum/90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedLink ? 'Copied!' : 'Copy Link Only'}
                      </button>
                      <button
                        onClick={handleCopyMessage}
                        className="flex-1 bg-brand-rose text-brand-plum py-3.5 px-5 rounded-full font-sans tracking-[0.15em] font-bold text-[11px] uppercase hover:bg-brand-rose/80 transition-all shadow-sm border border-brand-lavender/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        {copiedMessage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedMessage ? 'Copied!' : 'Copy Full Message'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 border-2 border-dashed border-stone-200/80 rounded-2xl"
                  >
                    <LinkIcon className="w-8 h-8 mx-auto mb-4 text-stone-300" />
                    <p className="text-stone-400 font-serif italic text-base">
                      Fill in the form and click <span className="font-semibold text-stone-500">Generate Link</span> to create a personalized invitation.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
