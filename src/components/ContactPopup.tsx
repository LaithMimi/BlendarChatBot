import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { submitContact } from '@/api/askApi';

const Contact: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setSubmitted(false);
    setOpen(false);
    // Reset form data and errors when closing
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'נדרש למלא שדה זה';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'נדרש למלא שדה זה';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'נדרש למלא שדה זה';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'אימייל לא תקין';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'נדרש למלא שדה זה';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submitContact(formData);
      setSubmitted(true);
      // auto-close after 3s
      setTimeout(handleClose, 3000);
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'שגיאה בשליחת הטופס, נסה שוב'
      }));
    }
  };

  return (
    <div>
      {/* Contact Button */}
      <button
        onClick={handleOpen}
        className="w-full sm:w-auto bg-transparent border-2 border-white text-white text-lg py-3 px-12 rounded-full transition-transform transform hover:scale-105 hover:bg-white/10 flex items-center gap-2"
        aria-label="צור קשר"
      >
        צור קשר
        <ExternalLink className="h-5 w-5" />
      </button>

      {/* Contact Popup */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 animate-scale-in rtl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="סגור"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-right">
              צור קשר
            </h3>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600 dark:text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-green-600 dark:text-green-400 font-medium text-lg">
                  ✅ ההודעה נשלחה בהצלחה!
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  נחזור אליך בהקדם האפשרי
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    שם פרטי <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-brand-bordeaux focus:border-brand-bordeaux dark:bg-gray-700 text-black dark:text-white`}
                    dir="rtl"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    שם משפחה <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-brand-bordeaux focus:border-brand-bordeaux dark:bg-gray-700 text-black dark:text-white`}
                    dir="rtl"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    אימייל <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 pyro-2 border ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-brand-bordeaux focus:border-brand-bordeaux dark:bg-gray-700 text-black dark:text-white`}
                    dir="rtl"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    הודעה <span className="text-red-500">*</span>
                  </label>   
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.message
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-brand-bordeaux focus:border-brand-bordeaux dark:bg-gray-700 text-black dark:text-white`}
                    dir="rtl"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submission Error */}
                {errors.submit && (
                  <p className="mt-1 text-sm text-red-600">{errors.submit}</p>
                )}

                {/* Submit Button */}
                <div className="flex justify-start pt-2">
                  <button
                    type="submit"
                    className="bg-brand-bordeaux hover:bg-brand-bordeaux/90 text-white px-6 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-bordeaux focus:ring-offset-2"
                  >
                    שלח
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
