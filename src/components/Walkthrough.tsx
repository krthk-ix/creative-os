import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Upload, Settings as SettingsIcon, Zap } from 'lucide-react';

interface WalkthroughStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  position?: 'center' | 'top' | 'bottom';
}

const steps: WalkthroughStep[] = [
  {
    title: 'Welcome to ShootX!',
    description: 'Let us show you around. ShootX is your AI-powered creative studio for product photography, models, backgrounds, and more.',
    icon: Sparkles,
    position: 'center',
  },
  {
    title: 'Choose Your Workflow',
    description: 'Start by selecting a workflow from the sidebar or bottom menu. Choose from Human Model, Virtual Try-On, Color Change, and 7 other AI-powered tools.',
    icon: Zap,
    position: 'center',
  },
  {
    title: 'Upload Your Images',
    description: 'Upload images from your gallery, take a photo with your camera, or paste directly from your clipboard. We support JPG, PNG, WEBP, and AVIF formats.',
    icon: Upload,
    position: 'center',
  },
  {
    title: 'Customize Options',
    description: 'Configure workflow-specific settings like model type, backgrounds, colors, and more. Each workflow has unique options tailored to your needs.',
    icon: SettingsIcon,
    position: 'center',
  },
  {
    title: 'Generate & Download',
    description: 'Click generate to create your AI-powered visuals. Download individual results or export all at once. You can also chain workflows together!',
    icon: Sparkles,
    position: 'center',
  },
];

interface WalkthroughProps {
  onComplete: () => void;
}

export default function Walkthrough({ onComplete }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (hasSeenWalkthrough) {
      setShow(false);
      onComplete();
    }
  }, [onComplete]);

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

  if (!show) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />

      {/* Walkthrough Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon size={32} className="text-brand" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 leading-relaxed">
              {step.description}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-brand'
                      : index < currentStep
                      ? 'w-2 bg-brand/50'
                      : 'w-2 bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg font-medium transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
