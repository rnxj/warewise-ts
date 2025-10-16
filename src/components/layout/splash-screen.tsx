import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-background">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          aria-hidden
          className="inline-flex"
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.2,
            ease: 'linear',
          }}
        >
          <Loader2 className="h-6 w-6 text-primary" />
        </motion.span>
      </motion.div>
    </div>
  );
}
