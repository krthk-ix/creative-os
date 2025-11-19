import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const steps: WalkthroughStep[] = [
  {
    target: '[data-walkthrough="menu-button"]',
    title: 'Open Menu',
    description: 'Click here to access all features including Projects, Settings, Billing, and more.',
    position: 'right',
    action: 'Click to open',
  },
  {
    target: '[data-walkthrough="workflow-selector"]',
    title: 'Select Workflow',
    description: 'Choose from 10 AI-powered workflows. Start with Human Model or Virtual Try-On.',
    position: 'bottom',
    action: 'Click to select',
  },
  {
    target: '[data-walkthrough="layout-toggle"]',
    title: 'Switch Layout',
    description: 'Toggle between floating chat and split-view layouts for your preferred workspace.',
    position: 'left',
    action: 'Click to toggle',
  },
  {
    target: '[data-walkthrough="upload-area"]',
    title: 'Upload Images',
    description: 'Upload from gallery, camera, or paste directly from clipboard.',
    position: 'top',
  },
  {
    target: '[data-walkthrough="output-settings"]',
    title: 'Configure Output',
    description: 'Set number of outputs, format (WEBP, PNG, JPG, AVIF), and generation method.',
    position: 'top',
  },
  {
    target: '[data-walkthrough="generate-button"]',
    title: 'Generate',
    description: 'Click to create your AI-generated visuals. Results appear on the right panel.',
    position: 'top',
    action: 'Click to generate',
  },
];

interface WalkthroughProps {
  onComplete: () => void;
}

export default function Walkthrough({ onComplete }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (!hasSeenWalkthrough) {
      setTimeout(() => setShow(true), 1000);
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!show) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;

    if (element) {
      setTargetElement(element);

      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = 0;
      let left = 0;

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + scrollTop + 16;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'top':
          top = rect.top + scrollTop - 16;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 16;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - 16;
          break;
      }

      setTooltipPosition({ top, left });

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, show]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setShow(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setShow(false);
    onComplete();
  };

  if (!show || !targetElement) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Backdrop with spotlight effect */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Spotlight cutout */}
        <div
          className="absolute border-4 border-brand rounded-lg shadow-2xl pointer-events-auto"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[101] pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: step.position === 'bottom' || step.position === 'top'
            ? 'translateX(-50%)'
            : step.position === 'left'
            ? 'translate(-100%, -50%)'
            : 'translateY(-50%)',
          maxWidth: '320px',
        }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-brand overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-4">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Step counter */}
            <div className="text-xs font-semibold text-brand mb-2">
              Step {currentStep + 1} of {steps.length}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-6">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {step.description}
            </p>

            {/* Action hint */}
            {step.action && (
              <div className="mb-4 p-2 bg-brand/10 rounded-lg">
                <p className="text-xs font-medium text-brand flex items-center gap-1.5">
                  <ArrowRight size={14} />
                  {step.action}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Back
              </button>

              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-6 bg-brand'
                        : index < currentStep
                        ? 'w-1.5 bg-brand/50'
                        : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointer */}
        <div
          className={`absolute w-0 h-0 border-solid ${
            step.position === 'bottom'
              ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-brand'
              : step.position === 'top'
              ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-brand'
              : step.position === 'right'
              ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-brand'
              : 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-brand'
          }`}
        />
      </div>
    </>
  );
}
