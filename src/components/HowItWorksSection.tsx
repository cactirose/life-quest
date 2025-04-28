import { motion } from "framer-motion";
import { Scroll, Brain, Coins, Shield, Dna, Users } from "lucide-react";

const steps = [
  {
    icon: <Scroll className="w-8 h-8" />,
    title: "Create Quests",
    description: "Transform your daily tasks into epic quests with rewards and progression",
    color: "bg-rpg-purple/20"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Build Habits",
    description: "Develop consistent habits with streak bonuses and daily rewards",
    color: "bg-rpg-blue/20"
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Earn XP",
    description: "Gain experience points and coins by completing quests and challenges",
    color: "bg-rpg-yellow/20"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Equip Gear",
    description: "Purchase and equip items to boost your character's stats",
    color: "bg-rpg-green/20"
  },
  {
    icon: <Dna className="w-8 h-8" />,
    title: "Evolve Character",
    description: "Level up and unlock new abilities in your skill tree",
    color: "bg-rpg-red/20"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Join the Community",
    description: "Connect with fellow adventurers, share your progress, and get support on your journey!",
    color: "bg-rpg-purple/10"
  }
];

export function HowItWorksSection() {
  return (
    <section className="w-full bg-rpg-parchment py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-rpg text-rpg-brown mb-4">
            How It Works
          </h2>
          <p className="text-lg text-rpg-brown/80">
            Your journey to productivity begins here
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-rpg-brown text-rpg-tan rounded-full flex items-center justify-center font-pixel z-20 border-4 border-white shadow-lg">
                {index + 1}
              </div>
              <div className={`p-6 rounded-lg border-2 border-rpg-brown/20 ${step.color} backdrop-blur-sm`}>
                <div className="text-rpg-brown mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-pixel text-rpg-brown mb-2">
                  {step.title}
                </h3>
                <p className="text-rpg-brown/80">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 