import { motion } from "framer-motion";
import { Heart, Sparkle } from "lucide-react";

const benefits = [
  "Transform mundane tasks into exciting quests",
  "Stay motivated with RPG-style progression",
  "Track your growth through character development",
  "Earn rewards for completing daily challenges",
  "Build lasting habits with streak bonuses",
  "Join a community of productivity adventurers"
];

export function WhyLifeQuestSection() {
  // Animated particles for background
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-rpg-purple/20 rounded-full"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: 0 
            }}
            animate={{ 
              y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart className="w-12 h-12 text-secondary" />
            </motion.div>
          </div>
          <h2 className="text-3xl md:text-4xl font-rpg text-rpg-brown mb-4">
            Why Life Quest?
          </h2>
          <p className="text-lg text-rpg-brown/80">
            Experience productivity like never before
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-rpg-purple/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-rpg-blue/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-rpg-parchment/80 backdrop-blur-sm border-2 border-rpg-brown/20 rounded-2xl p-8">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-rpg-brown"
                >
                  <Sparkle className="w-5 h-5 flex-shrink-0 text-secondary" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 