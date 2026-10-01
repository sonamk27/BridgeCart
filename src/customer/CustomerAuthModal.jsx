import { useState } from 'react';
import { useCustomer } from './CustomerContext';

export default function CustomerAuthModal({ onClose }) {
  const { auth, loginWithPhone, enterGuestMode, updateProfile, logout } = useCustomer();

  const [activeTab, setActiveTab] = useState(auth.isAuthenticated && !auth.isGuest ? 'profile' : 'login');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState(auth.phone || '9876543210');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Profile edit form state
  const [profileData, setProfileData] = useState({
    name: auth.user?.name || '',
    phone: auth.user?.phone || '',
    email: auth.user?.email || '',
    address: auth.user?.address || '',
    preferredLanguage: auth.user?.preferredLanguage || 'English'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleSendOtp(e) {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError('');
    setStep('otp');
    setResendTimer(30);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp.trim() === '123456' || otp.trim().length === 6) {
      loginWithPhone(`+91 ${phoneNumber}`, profileData.name || 'Priya Sharma');
      onClose();
    } else {
      setOtpError('Invalid OTP. For testing, enter 123456.');
    }
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    updateProfile(profileData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--navy-deep)] to-[var(--navy-mid)] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/20 border border-[var(--teal)]/40 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <h3 className="font-bold text-[16px] leading-tight">Customer Account</h3>
              <p className="text-[12px] text-gray-300">
                {auth.isAuthenticated ? (auth.isGuest ? 'Guest Shopper' : auth.user?.name) : 'Sign in to BridgeCart'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher if logged in */}
        {auth.isAuthenticated && (
          <div className="flex border-b border-[var(--border)] bg-gray-50/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-[13px] font-bold text-center border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-[var(--teal)] text-[var(--teal-dark)] bg-white'
                  : 'border-transparent text-[var(--muted)] hover:text-gray-900'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('switch')}
              className={`flex-1 py-3 text-[13px] font-bold text-center border-b-2 transition-colors ${
                activeTab === 'switch'
                  ? 'border-[var(--teal)] text-[var(--teal-dark)] bg-white'
                  : 'border-transparent text-[var(--muted)] hover:text-gray-900'
              }`}
            >
              Switch / Login
            </button>
          </div>
        )}

        <div className="p-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && auth.isAuthenticated && (
            <div className="space-y-4">
              {auth.isGuest ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                  <div className="text-2xl mb-1">🛒</div>
                  <div className="font-bold text-[14px] text-amber-900">You are browsing as Guest</div>
                  <p className="text-[12px] text-amber-700 mt-1 mb-3">
                    Guest mode lets you search in-store products and use the store map. To access your shopping history, digital receipts, and the Community Wallet, please log in with your phone number.
                  </p>
                  <button
                    onClick={() => setActiveTab('switch')}
                    className="w-full bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13px] py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    Log In with Mobile Number
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[12px] font-semibold flex items-center gap-2">
                      <span>✓</span> Profile updated successfully!
                    </div>
                  )}

                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-[var(--teal)]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={profileData.phone}
                        disabled
                        className="w-full bg-gray-100 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13px] text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">Language</label>
                      <select
                        value={profileData.preferredLanguage}
                        onChange={e => setProfileData({ ...profileData, preferredLanguage: e.target.value })}
                        className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-[13px] focus:outline-[var(--teal)]"
                      >
                        <option>English</option>
                        <option>Marathi (मराठी)</option>
                        <option>Hindi (हिंदी)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-[var(--teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">Home Address / Landmark</label>
                    <textarea
                      rows={2}
                      value={profileData.address}
                      onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2 text-[13px] focus:outline-[var(--teal)]"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13px] py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      Save Profile Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setActiveTab('login');
                      }}
                      className="px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[12.5px] rounded-xl transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* LOGIN / SWITCH TAB */}
          {(activeTab === 'login' || activeTab === 'switch' || !auth.isAuthenticated) && (
            <div>
              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-center pb-1">
                    <div className="font-extrabold text-[17px] text-[var(--navy-deep)]">
                      Instant Mobile Login
                    </div>
                    <p className="text-[12.5px] text-[var(--muted)] mt-1">
                      Enter your mobile number to receive a secure one-time passcode.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">
                      Mobile Number
                    </label>
                    <div className="flex border border-[var(--border)] rounded-xl overflow-hidden focus-within:border-[var(--teal)] shadow-sm">
                      <span className="bg-gray-100 px-3.5 py-2.5 text-[13.5px] font-bold text-gray-600 border-r border-[var(--border)] flex items-center">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="flex-1 px-3.5 py-2.5 text-[14px] font-medium outline-none"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {otpError && (
                    <div className="text-[12px] text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13.5px] py-3 rounded-xl transition-all shadow-md hover:shadow-teal-500/20"
                  >
                    Send Verification OTP →
                  </button>

                  {/* Demo Quick Button */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11.5px]">
                    <span className="text-gray-600">Quick Demo User:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneNumber('9876543210');
                        setStep('otp');
                        setOtp('123456');
                      }}
                      className="font-bold text-[var(--teal-dark)] hover:underline"
                    >
                      Fill Demo Account (+91 98765 43210)
                    </button>
                  </div>

                  {/* Guest mode option */}
                  <div className="pt-2 border-t border-[var(--border)] text-center">
                    <button
                      type="button"
                      onClick={() => {
                        enterGuestMode();
                        onClose();
                      }}
                      className="text-[13px] font-semibold text-[var(--muted)] hover:text-[var(--navy-deep)] hover:underline"
                    >
                      Skip and continue as Guest ➔
                    </button>
                  </div>
                </form>
              ) : (
                /* OTP VERIFICATION STEP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center pb-1">
                    <div className="font-extrabold text-[17px] text-[var(--navy-deep)]">
                      Verify One-Time Password
                    </div>
                    <p className="text-[12.5px] text-[var(--muted)] mt-1">
                      Enter the 6-digit code sent to <strong className="text-gray-800">+91 {phoneNumber}</strong>
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full border-2 border-[var(--teal)] rounded-2xl py-3.5 text-center text-[22px] tracking-[0.4em] font-extrabold text-[var(--navy-deep)] focus:outline-none shadow-sm"
                      required
                      autoFocus
                    />
                  </div>

                  {otpError && (
                    <div className="text-[12px] text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13.5px] py-3 rounded-xl transition-all shadow-md"
                  >
                    Verify & Access BridgeCart
                  </button>

                  <div className="flex items-center justify-between text-[12px] text-[var(--muted)] pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="hover:underline text-[var(--navy-deep)] font-semibold"
                    >
                      ← Change number
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="text-[var(--teal-dark)] font-bold hover:underline"
                    >
                      Auto-fill OTP (123456)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
