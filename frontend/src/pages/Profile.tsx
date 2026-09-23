import React, { useState } from 'react';
import { UserCircle, Mail, Phone, Globe, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { useApp } from '../context/AppContext';

export const Profile: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const { addToast } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await authService.updateProfile({
        fullName,
        phone,
        preferredLanguage
      });
      if (res.success) {
        updateUserData({ fullName, phone, preferredLanguage });
        addToast({ type: 'success', title: 'Profile Updated', message: 'Your personal settings have been saved.' });
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await authService.changePassword({
        currentPassword,
        newPassword
      });
      if (res.success) {
        addToast({ type: 'success', title: 'Password Changed', message: 'Your password was updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to change password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
          <UserCircle className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Senior Profile & Account</h1>
          <p className="text-sm text-slate-600">Manage your personal information and account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-sky-700" />
            <span>Personal Information</span>
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="mt-1 w-full p-3.5 border-2 border-slate-100 bg-slate-50 text-slate-500 rounded-2xl font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800">Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600 bg-white"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-3.5 px-6 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-sky-700" />
              <span>Change Password</span>
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60"
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
            <Shield className="w-6 h-6 text-sky-700 shrink-0" />
            <span className="text-xs text-slate-600 font-medium leading-relaxed">
              Your password is encrypted with one-way bcrypt hashing. Neither administrators nor staff can ever see your raw password.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
