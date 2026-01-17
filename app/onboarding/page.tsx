'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  User,
  Key,
  Rocket,
  Map,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';

type Step = 'welcome' | 'profile' | 'apikey' | 'firstmission' | 'tour';

const avatarOptions = [
  { id: 'general', name: 'General', icon: '⭐', description: 'Balanced commander' },
  { id: 'engineer', name: 'Engineer', icon: '⚙️', description: 'Tech-focused' },
  { id: 'strategist', name: 'Strategist', icon: '🎯', description: 'Planning expert' },
  { id: 'speedrunner', name: 'Speedrunner', icon: '⚡', description: 'Fast deployment' },
];

const missionTypes = [
  { id: 'coding', name: 'Software Development', icon: '💻' },
  { id: 'research', name: 'Research & Analysis', icon: '🔍' },
  { id: 'content', name: 'Content Creation', icon: '✍️' },
  { id: 'automation', name: 'Task Automation', icon: '🤖' },
  { id: 'mixed', name: 'Mixed Operations', icon: '🎲' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [baseName, setBaseName] = useState('Command Base');
  const [commanderAvatar, setCommanderAvatar] = useState('general');
  const [missionType, setMissionType] = useState('mixed');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [keyValidated, setKeyValidated] = useState(false);

  const steps: Step[] = ['welcome', 'profile', 'apikey', 'firstmission', 'tour'];
  const currentIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const validateApiKey = async () => {
    if (!anthropicKey.startsWith('sk-ant-')) {
      setError('Invalid API key format. It should start with sk-ant-');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simple validation - in production you'd test the key
      // For MVP, we'll just check the format
      setKeyValidated(true);
      handleNext();
    } catch {
      setError('Failed to validate API key');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      // Update profile
      const profileRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseName,
          commanderAvatar,
          primaryMissionType: missionType,
          onboardingCompleted: true,
          onboardingStep: 5,
        }),
      });

      if (!profileRes.ok) {
        throw new Error('Failed to update profile');
      }

      // Store API key if provided
      if (anthropicKey) {
        await fetch('/api/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'anthropic',
            key: anthropicKey,
          }),
        });
      }

      router.push('/dashboard');
    } catch {
      setError('Failed to complete onboarding');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-purple/5" />

      <div className="w-full max-w-2xl z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2 text-xs ${
                  i <= currentIndex ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    i < currentIndex
                      ? 'bg-primary text-primary-foreground'
                      : i === currentIndex
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-muted'
                  }`}
                >
                  {i < currentIndex ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface-elevated border border-border rounded-xl p-8">
          <AnimatePresence mode="wait">
            {currentStep === 'welcome' && (
              <WelcomeStep onNext={handleNext} />
            )}
            {currentStep === 'profile' && (
              <ProfileStep
                baseName={baseName}
                setBaseName={setBaseName}
                commanderAvatar={commanderAvatar}
                setCommanderAvatar={setCommanderAvatar}
                missionType={missionType}
                setMissionType={setMissionType}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 'apikey' && (
              <ApiKeyStep
                apiKey={anthropicKey}
                setApiKey={setAnthropicKey}
                onValidate={validateApiKey}
                onBack={handleBack}
                onSkip={handleNext}
                loading={loading}
                error={error}
              />
            )}
            {currentStep === 'firstmission' && (
              <FirstMissionStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 'tour' && (
              <TourStep
                onComplete={completeOnboarding}
                onBack={handleBack}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
        <Zap className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Welcome, Commander</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        You&apos;re about to take command of your very own AI army. In just a few
        steps, you&apos;ll be deploying agents and conquering your workflows.
      </p>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        Begin Setup
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function ProfileStep({
  baseName,
  setBaseName,
  commanderAvatar,
  setCommanderAvatar,
  missionType,
  setMissionType,
  onNext,
  onBack,
}: {
  baseName: string;
  setBaseName: (v: string) => void;
  commanderAvatar: string;
  setCommanderAvatar: (v: string) => void;
  missionType: string;
  setMissionType: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Commander Profile</h2>
      </div>

      <div className="space-y-6">
        {/* Base Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Base Name</label>
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="Command Base"
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Commander Type</label>
          <div className="grid grid-cols-2 gap-3">
            {avatarOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setCommanderAvatar(option.id)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  commanderAvatar === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mission Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Focus
          </label>
          <div className="grid grid-cols-3 gap-2">
            {missionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setMissionType(type.id)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  missionType === type.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <div className="text-xs">{type.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ApiKeyStep({
  apiKey,
  setApiKey,
  onValidate,
  onBack,
  onSkip,
  loading,
  error,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  onValidate: () => void;
  onBack: () => void;
  onSkip: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-neon-orange" />
        <h2 className="text-2xl font-bold">Power Core Setup</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        Connect your Anthropic API key to power your AI agents. This is required
        for agents to work.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          />
        </div>

        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          Get your API key from Anthropic Console
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={onValidate}
            disabled={!apiKey || loading}
            className="px-6 py-2 bg-neon-orange text-surface font-medium rounded-lg hover:bg-neon-orange/90 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Connect
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FirstMissionStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-6 h-6 text-neon-purple" />
        <h2 className="text-2xl font-bold">Ready for Deployment</h2>
      </div>

      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
          <span className="text-4xl">🤖</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Your First Agents Await</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          You&apos;ll start with 3 agents ready for action: a Scout for research,
          a Builder for coding, and a Courier for communications.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-surface rounded-lg text-center">
          <span className="text-2xl">🔍</span>
          <div className="text-sm font-medium mt-2">Scout Alpha</div>
          <div className="text-xs text-muted-foreground">Research</div>
        </div>
        <div className="p-4 bg-surface rounded-lg text-center">
          <span className="text-2xl">🛠️</span>
          <div className="text-sm font-medium mt-2">Builder Prime</div>
          <div className="text-xs text-muted-foreground">Development</div>
        </div>
        <div className="p-4 bg-surface rounded-lg text-center">
          <span className="text-2xl">📨</span>
          <div className="text-sm font-medium mt-2">Courier Swift</div>
          <div className="text-xs text-muted-foreground">Communication</div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-neon-purple text-white font-medium rounded-lg hover:bg-neon-purple/90 transition-colors inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function TourStep({
  onComplete,
  onBack,
  loading,
}: {
  onComplete: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Map className="w-6 h-6 text-neon-green" />
        <h2 className="text-2xl font-bold">Command Center Overview</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-4 p-4 bg-surface rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
            🗺️
          </div>
          <div>
            <h4 className="font-medium">Command Map</h4>
            <p className="text-sm text-muted-foreground">
              Your 3D battlefield where all agents and missions are visible.
              Click and drag to select agents, right-click to deploy.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-surface rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
            👥
          </div>
          <div>
            <h4 className="font-medium">Agent Barracks</h4>
            <p className="text-sm text-muted-foreground">
              View and manage your agents on the left sidebar. Click to select,
              Shift+click to multi-select.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-surface rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-neon-orange/20 flex items-center justify-center flex-shrink-0">
            🎯
          </div>
          <div>
            <h4 className="font-medium">Mission Control</h4>
            <p className="text-sm text-muted-foreground">
              Create and track missions. Assign agents and watch them work in
              real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={loading}
          className="px-8 py-3 bg-neon-green text-surface font-semibold rounded-lg hover:bg-neon-green/90 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Enter Command Center
              <Rocket className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
