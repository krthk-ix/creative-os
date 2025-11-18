import { useState, useEffect, useRef } from 'react';
import { X, ScrollText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollComplete: () => void;
}

export default function TermsModal({ isOpen, onClose, onScrollComplete }: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
        onScrollComplete();
      }
    }
  };

  const handleAgree = () => {
    if (hasScrolledToBottom) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ScrollText size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms and Conditions
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-600 dark:text-gray-400"
          >
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using ShootX ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                2. Use of Service
              </h3>
              <p className="mb-2">
                ShootX provides AI-powered visual generation tools for product photography, human models, backgrounds, and related creative workflows. You agree to use the Service only for lawful purposes and in accordance with these Terms.
              </p>
              <p>
                You may not use the Service:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>To generate content that violates any applicable law or regulation</li>
                <li>To create misleading, fraudulent, or deceptive content</li>
                <li>To infringe upon the intellectual property rights of others</li>
                <li>To generate harmful, offensive, or inappropriate content</li>
                <li>To attempt to reverse engineer or compromise the Service</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                3. User Accounts
              </h3>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                4. Intellectual Property
              </h3>
              <p className="mb-2">
                The Service and its original content, features, and functionality are owned by ShootX and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                Content generated through the Service: You retain ownership of images you upload. Generated outputs are licensed to you for commercial and personal use, subject to these Terms.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                5. Credits and Billing
              </h3>
              <p>
                Certain features of the Service require credits or subscription plans. By purchasing credits or subscribing, you agree to pay all fees and applicable taxes. All fees are non-refundable except as required by law.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                6. Data Processing and Privacy
              </h3>
              <p>
                We process your personal data in accordance with our Privacy Policy. By using the Service, you consent to such processing and warrant that all data provided by you is accurate.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                7. Content Guidelines
              </h3>
              <p>
                You agree not to upload or generate content that:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Contains personal information of others without consent</li>
                <li>Depicts violence, hatred, or discrimination</li>
                <li>Violates intellectual property or privacy rights</li>
                <li>Contains malware or harmful code</li>
                <li>Misrepresents the source or ownership of content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                8. Limitation of Liability
              </h3>
              <p>
                In no event shall ShootX, its directors, employees, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                9. Service Modifications
              </h3>
              <p>
                We reserve the right to modify or discontinue the Service (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                10. Termination
              </h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                11. Governing Law
              </h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ShootX operates, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                12. Changes to Terms
              </h3>
              <p>
                We reserve the right to update or modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Last Updated: November 2024
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                For questions about these Terms, please contact: support@shootx.ai
              </p>
            </div>

            {!hasScrolledToBottom && (
              <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent pt-8 pb-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium animate-bounce">
                  Scroll down to continue
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleAgree}
              disabled={!hasScrolledToBottom}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-sm ${
                hasScrolledToBottom
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasScrolledToBottom ? 'I Agree to Terms' : 'Please scroll to the bottom'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
