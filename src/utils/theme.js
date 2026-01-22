/**
 * AcuTrace Theme Configuration
 * Consistent Emerald/Green Theme for Party Ledger & Fund Flow Platform
 */

// Primary color palette
export const colors = {
  primary: '#10b981',      // Emerald 500
  secondary: '#059669',    // Emerald 600
  accent: '#34d399',       // Emerald 400
  dark: '#064e3b',         // Emerald 900
  light: '#ecfdf5',        // Emerald 50
  
  // Functional colors
  credit: '#10b981',       // Emerald - money in
  debit: '#f43f5e',        // Rose - money out
  transfer: '#6366f1',     // Indigo - bank transfers
  upi: '#a855f7',          // Purple - UPI payments
  
  // Background colors
  background: {
    primary: '#0f172a',    // Slate 900
    secondary: '#1e3a5f',  // Slate 800
    card: 'rgba(16, 185, 129, 0.1)',
    cardBorder: 'rgba(16, 185, 129, 0.2)',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
    emerald: '#10b981',
  }
};

// Gradient definitions
export const gradients = {
  primary: 'bg-gradient-to-r from-green-600 to-emerald-600',
  secondary: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  subtle: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
  dark: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
  accent: 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600',
};

// Shadow utilities
export const shadows = {
  emerald: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
  emeraldGlow: '0 0 20px rgba(16, 185, 129, 0.3)',
  emeraldInner: 'inset 0 2px 4px 0 rgba(16, 185, 129, 0.1)',
};

// Animation utilities
export const animations = {
  pulseSlow: 'animate-pulse-slow',
  glow: 'animate-glow',
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
};

// Component class utilities
export const theme = {
  // Button styles
  button: {
    primary: `
      px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
      text-white font-semibold rounded-xl 
      hover:opacity-90 transition-all transform hover:scale-105
      shadow-lg shadow-emerald-500/25
    `,
    secondary: `
      px-6 py-3 bg-white/10 text-white font-semibold rounded-xl 
      border border-white/20 hover:bg-white/20 transition-all
    `,
    danger: `
      px-4 py-2 bg-rose-500/20 text-rose-400 
      border border-rose-500/30 rounded-lg 
      hover:bg-rose-500/30 transition-all
    `,
    emerald: `
      px-4 py-2 bg-emerald-500/20 text-emerald-400 
      border border-emerald-500/30 rounded-lg 
      hover:bg-emerald-500/30 transition-all
    `,
  },
  
  // Card styles
  card: {
    default: `
      bg-white/5 backdrop-blur-xl rounded-2xl 
      border border-white/10 p-6
    `,
    emerald: `
      bg-emerald-500/10 backdrop-blur-xl rounded-2xl 
      border border-emerald-500/30 p-6
    `,
    elevated: `
      bg-white/10 backdrop-blur-xl rounded-2xl 
      border border-white/20 p-6 shadow-emerald
    `,
  },
  
  // Badge styles
  badge: {
    credit: `
      px-3 py-1 bg-emerald-500/20 text-emerald-400 
      border border-emerald-500/30 rounded-full text-xs font-medium
    `,
    debit: `
      px-3 py-1 bg-rose-500/20 text-rose-400 
      border border-rose-500/30 rounded-full text-xs font-medium
    `,
    transfer: `
      px-3 py-1 bg-indigo-500/20 text-indigo-400 
      border border-indigo-500/30 rounded-full text-xs font-medium
    `,
    upi: `
      px-3 py-1 bg-purple-500/20 text-purple-400 
      border border-purple-500/30 rounded-full text-xs font-medium
    `,
  },
  
  // Input styles
  input: `
    w-full px-4 py-3 bg-white/5 border border-white/20 
    rounded-xl text-white placeholder-white/40 
    focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
    transition-all
  `,
  
  // Tab styles
  tab: {
    active: `
      flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
      bg-gradient-to-r from-green-600 to-emerald-600 text-white 
      shadow-lg shadow-emerald-500/25 transition-all
    `,
    inactive: `
      flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
      bg-white/5 text-white/60 hover:bg-white/10 transition-all
    `,
  },
  
  // Table styles
  table: {
    header: `
      bg-white/5 rounded-xl px-4 py-3 
      text-left text-xs font-semibold text-white/60 uppercase tracking-wider
    `,
    cell: `
      px-4 py-3 text-sm text-white 
      border-t border-white/10
    `,
    rowHover: `
      hover:bg-white/5 transition-colors
    `,
  },
  
  // Progress bar
  progress: `
    h-2 bg-white/10 rounded-full overflow-hidden
  `,
  progressBar: `
    h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-500
  `,
};

// Export helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getCategoryColor = (category) => {
  const colors = {
    credit: 'emerald',
    debit: 'rose',
    transfer: 'indigo',
    upi: 'purple',
  };
  return colors[category?.toLowerCase()] || 'emerald';
};

export const getBadgeClass = (category) => {
  const classes = {
    credit: theme.badge.credit,
    debit: theme.badge.debit,
    transfer: theme.badge.transfer,
    upi: theme.badge.upi,
  };
  return classes[category?.toLowerCase()] || theme.badge.emerald;
};

export default {
  colors,
  gradients,
  shadows,
  animations,
  theme,
  formatCurrency,
  getCategoryColor,
  getBadgeClass,
};

