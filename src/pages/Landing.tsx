import { Button } from "@/components/ui/button";
import { 
  Sparkles,
  ScrollText,
  Brain,
  Trophy,
  Calendar,
  User,
  Package,
  Store,
  BookHeart,
  Heart,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <div className="group bg-rpg-tan/50 rounded-lg p-6 flex flex-col items-center text-center transition-all hover:transform hover:scale-[1.02] hover:shadow-lg">
    <div className="h-16 w-16 rounded-full bg-rpg-brown flex items-center justify-center mb-4 transition-all group-hover:shadow-[0_0_15px_rgba(var(--rpg-gold-rgb)/0.3)]">
      <Icon className="h-8 w-8 text-rpg-tan transition-all group-hover:scale-110" />
    </div>
    <h3 className="font-pixel text-lg text-rpg-brown mb-2">{title}</h3>
    <p className="text-rpg-brown/80 text-sm">{description}</p>
  </div>
);

const ProcessStep = ({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="group flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-rpg-tan/20">
    <div className="h-12 w-12 rounded-full bg-rpg-brown flex-shrink-0 flex items-center justify-center font-pixel text-rpg-tan group-hover:shadow-[0_0_15px_rgba(var(--rpg-gold-rgb)/0.3)]">
      {number}
    </div>
    <div>
      <h3 className="font-pixel text-lg text-rpg-brown mb-1">{title}</h3>
      <p className="text-rpg-brown/80">{description}</p>
    </div>
  </div>
);

const SectionDivider = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-24 h-px bg-rpg-brown/20" />
    <Sparkles className="h-6 w-6 text-rpg-gold mx-4" />
    <div className="w-24 h-px bg-rpg-brown/20" />
  </div>
);

export const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollButton = document.getElementById('scroll-to-top');
      if (scrollButton) {
        if (window.scrollY > 500) {
          scrollButton.classList.add('visible');
        } else {
          scrollButton.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-rpg-cream">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-32 w-32 bg-rpg-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-48 w-48 bg-rpg-brown/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 h-40 w-40 bg-rpg-gold/5 rounded-full blur-3xl" />
          {/* Pixel stars decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--rpg-gold)_1px,_transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative">
          <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-rpg-brown mb-6 [text-shadow:2px_2px_0px_rgba(var(--rpg-gold-rgb)/0.2)]">
            Gamify Your Life.<br />
            Become the Hero of Your Own Story.
          </h1>
          <p className="text-xl text-rpg-brown/80 mb-8 max-w-3xl mx-auto">
            Turn your real-world habits, goals, and routines into quests. Build your character, 
            unlock achievements, and level up — all by living with purpose.
          </p>
          <Button 
            size="lg"
            className="font-pixel text-lg px-8 py-6 relative overflow-hidden group"
            onClick={() => navigate("/signup")}
          >
            <span className="relative z-10">Start Your Quest</span>
            <div className="absolute inset-0 bg-gradient-to-r from-rpg-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section className="bg-rpg-tan/30 py-20" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-rpg-gold" />
            How It Works
          </h2>
          <div className="grid gap-8 max-w-3xl mx-auto">
            <ProcessStep 
              number={1}
              title="Create Quests"
              description="Break your goals into epic main quests, quick side quests, and big boss battles."
            />
            <ProcessStep 
              number={2}
              title="Build Habits"
              description="Stay consistent with daily habits and watch your streaks grow."
            />
            <ProcessStep 
              number={3}
              title="Earn XP and Coins"
              description="Complete tasks to level up and earn coins to spend in the shop."
            />
            <ProcessStep 
              number={4}
              title="Equip Gear"
              description="Reward yourself with armor, weapons, or real-life perks — all tracked in your inventory."
            />
            <ProcessStep 
              number={5}
              title="Evolve Your Character"
              description="Customize your skills, track attributes like strength and wisdom, and become your ideal future self."
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Feature Grid */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-rpg-gold" />
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={ScrollText}
              title="Quests"
              description="Transform your goals into epic quests and track your progress"
            />
            <FeatureCard 
              icon={Brain}
              title="Skill Tree"
              description="Level up your real-life skills and track your progress"
            />
            <FeatureCard 
              icon={Trophy}
              title="Achievements"
              description="Unlock achievements as you complete goals and form habits"
            />
            <FeatureCard 
              icon={Calendar}
              title="Habits"
              description="Build consistent daily habits and maintain your streaks"
            />
            <FeatureCard 
              icon={User}
              title="Character"
              description="Customize your character and track your attributes"
            />
            <FeatureCard 
              icon={Package}
              title="Inventory"
              description="Collect and manage your earned rewards and items"
            />
            <FeatureCard 
              icon={Store}
              title="Shop"
              description="Spend your earned coins on rewards and perks"
            />
            <FeatureCard 
              icon={BookHeart}
              title="Mood & Journal"
              description="Track your mood and reflect on your journey"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why Life Quest */}
      <section className="bg-rpg-tan/30 py-20" id="why">
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-rpg-gold" />
            Why Life Quest?
          </h2>
          <div className="max-w-3xl mx-auto bg-rpg-cream rounded-lg p-8 shadow-[0_0_30px_rgba(var(--rpg-gold-rgb)/0.1)] transition-all hover:shadow-[0_0_40px_rgba(var(--rpg-gold-rgb)/0.15)]">
            <ul className="space-y-6">
              <li className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                <span className="text-rpg-brown text-lg">Built by someone with no coding experience — truly for everyone</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                <span className="text-rpg-brown text-lg">Inspired by RPGs and habit systems that actually stick</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                <span className="text-rpg-brown text-lg">Design your own skills, achievements, and rewards</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                <span className="text-rpg-brown text-lg">Fun-first productivity</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-3xl text-rpg-brown mb-8">
            Ready to Start Your Adventure?
          </h2>
          <Button 
            size="lg"
            className="font-pixel text-lg px-8 py-6 relative overflow-hidden group"
            onClick={() => navigate("/signup")}
          >
            <span className="relative z-10">Start Questing</span>
            <div className="absolute inset-0 bg-gradient-to-r from-rpg-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rpg-brown/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-rpg-brown/80">Made with</span>
              <Heart className="h-4 w-4 text-rpg-gold fill-rpg-gold" />
              <span className="text-rpg-brown/80">using Lovable + Cursor</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-rpg-brown/80 hover:text-rpg-brown"
                onClick={() => window.location.href = 'mailto:feedback@lifequest.app'}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Feedback
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-rpg-brown/80 hover:text-rpg-brown"
                onClick={() => window.open('https://discord.gg/lifequest', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </div>
            <div className="text-sm text-rpg-brown/60">
              © 2024 Life Quest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-rpg-brown text-rpg-tan p-3 rounded-full shadow-lg hover:bg-rpg-brown/90 transition-all opacity-0 translate-y-full pointer-events-none [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:pointer-events-auto"
        style={{
          opacity: 0,
          transform: 'translateY(100%)',
          transition: 'opacity 0.3s, transform 0.3s'
        }}
        id="scroll-to-top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}; 