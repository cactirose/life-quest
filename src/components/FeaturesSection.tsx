import { motion } from "framer-motion";
import { 
  ScrollText, 
  Sparkle, 
  Target, 
  Flag, 
  Calendar,
  ListChecks,
  Award,
  Smile
} from "lucide-react";

const features = [
  {
    icon: <ScrollText className="w-6 h-6" />,
    title: "Quest Tracking",
    description: "Transform tasks into epic quests with rewards",
    color: "bg-rpg-purple/10"
  },
  {
    icon: <Sparkle className="w-6 h-6" />,
    title: "Character Profile",
    description: "Customize and level up your character",
    color: "bg-rpg-blue/10"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Skill Tree",
    description: "Unlock new abilities and progress",
    color: "bg-rpg-green/10"
  },
  {
    icon: <Flag className="w-6 h-6" />,
    title: "Shop & Inventory",
    description: "Purchase gear and manage items",
    color: "bg-rpg-yellow/10"
  },
  {
    icon: <ListChecks className="w-6 h-6" />,
    title: "Habit Building",
    description: "Track and maintain daily habits",
    color: "bg-rpg-red/10"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Achievements",
    description: "Complete challenges for rewards",
    color: "bg-rpg-purple/10"
  },
  {
    icon: <Smile className="w-6 h-6" />,
    title: "Mood Tracking",
    description: "Monitor your daily mood and energy",
    color: "bg-rpg-blue/10"
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Daily Streaks",
    description: "Maintain login streaks for bonuses",
    color: "bg-rpg-green/10"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-rpg-tan/20 to-rpg-parchment">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-rpg text-rpg-brown mb-4">
            Features
          </h2>
          <p className="text-lg text-rpg-brown/80">
            Everything you need for your productivity journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className={`p-6 rounded-lg border-2 border-rpg-brown/10 ${feature.color} backdrop-blur-sm
                hover:border-rpg-brown/30 transition-colors duration-300`}
            >
              <div className="text-rpg-brown mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-pixel text-rpg-brown mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-rpg-brown/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 