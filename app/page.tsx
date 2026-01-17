'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Users, Target, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch {
        // Not authenticated, stay on landing page
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-purple/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10 max-w-4xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-neon-blue">Command</span>{' '}
              <span className="text-foreground">Claude</span>
              <br />
              <span className="text-neon-purple">and</span>{' '}
              <span className="text-foreground">Conquer</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12"
          >
            Build your AI army. Conquer your workflows.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-4 bg-neon-blue text-surface font-semibold rounded-lg hover:bg-neon-blue/90 transition-all flex items-center justify-center gap-2 glow-blue"
            >
              Start Commanding
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-4 border border-border text-foreground rounded-lg hover:bg-surface-elevated transition-all"
            >
              Sign In
            </button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4 z-10"
        >
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Visual Army Management"
            description="See all your AI agents on a 3D command map. Drag-select, deploy, and monitor in real-time."
            color="text-neon-green"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="RTS-Style Control"
            description="Command your agents like units in StarCraft. Control groups, hotkeys, and instant deployment."
            color="text-neon-blue"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="MCP Integration"
            description="Connect GitHub, Slack, Notion, and more. Your agents have the tools they need."
            color="text-neon-purple"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>Powered by Claude &middot; Built for Commanders</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-surface-elevated border border-border hover:border-muted transition-colors">
      <div className={`${color} mb-4`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
