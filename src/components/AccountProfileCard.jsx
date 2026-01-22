import { Building2, User, MapPin, Calendar, Phone, Mail, CreditCard, Landmark, Globe } from 'lucide-react'

/**
 * AccountProfileCard - Displays extracted account details from bank statement
 * Uses consistent emerald theme styling
 */
export default function AccountProfileCard({ accountProfile }) {
  if (!accountProfile || Object.keys(accountProfile).length === 0) {
    return null
  }

  const {
    account_holder_name,
    bank_name,
    branch_name,
    account_number,
    ifsc_code,
    micr_code,
    gstin,
    registered_mobile,
    registered_email,
    address,
    city,
    state,
    country,
    statement_period,
    joint_holder_name,
    account_type,
  } = accountProfile

  const formatField = (label, value, icon) => {
    if (!value) return null
    return (
      <div key={label} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
          <p className="text-sm text-white font-medium truncate">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 px-6 py-4 border-b border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Account Profile</h3>
            <p className="text-sm text-emerald-300/70">Extracted from bank statement</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6">
        {/* Primary Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {formatField('Account Holder', account_holder_name, <User className="w-4 h-4 text-emerald-400" />)}
          {formatField('Bank Name', bank_name, <Landmark className="w-4 h-4 text-emerald-400" />)}
          {formatField('Branch', branch_name, <Building2 className="w-4 h-4 text-emerald-400" />)}
          {formatField('Account Number', account_number, <CreditCard className="w-4 h-4 text-emerald-400" />)}
          {formatField('IFSC Code', ifsc_code, <Globe className="w-4 h-4 text-emerald-400" />)}
          {formatField('Account Type', account_type, <CreditCard className="w-4 h-4 text-emerald-400" />)}
        </div>

        {/* Secondary Info */}
        {(micr_code || gstin || statement_period || joint_holder_name) && (
          <div className="border-t border-emerald-500/20 pt-4 mb-4">
            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">Additional Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {formatField('MICR Code', micr_code, <CreditCard className="w-4 h-4 text-emerald-400" />)}
              {formatField('GSTIN', gstin, <Building2 className="w-4 h-4 text-emerald-400" />)}
              {formatField('Statement Period', statement_period, <Calendar className="w-4 h-4 text-emerald-400" />)}
              {formatField('Joint Holder', joint_holder_name, <User className="w-4 h-4 text-emerald-400" />)}
            </div>
          </div>
        )}

        {/* Contact & Location Info */}
        {(registered_mobile || registered_email || address || city || state || country) && (
          <div className="border-t border-emerald-500/20 pt-4">
            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">Contact & Location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formatField('Mobile', registered_mobile, <Phone className="w-4 h-4 text-emerald-400" />)}
              {formatField('Email', registered_email, <Mail className="w-4 h-4 text-emerald-400" />)}
              {formatField('Address', address, <MapPin className="w-4 h-4 text-emerald-400" />)}
              {formatField('City', city, <MapPin className="w-4 h-4 text-emerald-400" />)}
              {formatField('State', state, <MapPin className="w-4 h-4 text-emerald-400" />)}
              {formatField('Country', country, <Globe className="w-4 h-4 text-emerald-400" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

