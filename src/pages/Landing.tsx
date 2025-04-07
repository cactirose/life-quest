
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
  ExternalLink,
  Sword,
  TrendingUp,
  Target,
  Coins,
  Shield,
  Dices
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PixelButton } from "@/components/landing/PixelButton";
import { PixelCard } from "@/components/landing/PixelCard";
import { ProcessStepCard } from "@/components/landing/ProcessStepCard";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { SectionTitle } from "@/components/landing/SectionTitle";
import { ScrollDownIndicator } from "@/components/landing/ScrollDownIndicator";
import { FloatingParticles } from "@/components/landing/FloatingParticles";

const SectionDivider = () => (
  <div className="flex items-center justify-center py-12">
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
      <section className="relative min-h-screen flex items-center justify-center">
        <FloatingParticles count={80} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-32 w-32 bg-rpg-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-48 w-48 bg-rpg-brown/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 h-40 w-40 bg-rpg-gold/5 rounded-full blur-3xl" />
          {/* Pixel stars decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--rpg-gold)_1px,_transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10 flex flex-col items-center">
          {/* Hero illustration */}
          <div className="mb-6 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <div className="absolute inset-0 bg-rpg-brown rounded-lg rotate-45 animate-pulse-gentle" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute inset-2 bg-rpg-tan rounded-lg rotate-45 flex items-center justify-center">
                <Sword className="h-16 w-16 md:h-20 md:w-20 text-rpg-brown rotate-[315deg] animate-float" />
              </div>
            </div>
            <div className="absolute -top-3 -right-3 h-10 w-10 bg-rpg-gold/80 rounded-full animate-pulse-gentle flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-rpg-brown" />
            </div>
          </div>

          <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-rpg-brown mb-6 [text-shadow:2px_2px_0px_rgba(var(--rpg-gold-rgb)/0.2)]">
            Gamify Your Life.<br />
            Become the Hero of Your Own Story.
          </h1>
          <p className="text-xl text-rpg-brown/80 mb-8 max-w-3xl mx-auto">
            Turn your real-world habits, goals, and routines into quests. Build your character, 
            unlock achievements, and level up — all by living with purpose.
          </p>
          
          <PixelButton 
            className="animate-scale-in"
            onClick={() => navigate("/signup")}
          >
            Start Your Quest
          </PixelButton>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ScrollDownIndicator targetId="how-it-works" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section className="bg-rpg-tan/30 py-20" id="how-it-works">
        <div className="container mx-auto px-4">
          <SectionTitle icon={Trophy}>How It Works</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <ProcessStepCard 
              number={1}
              icon={ScrollText}
              title="Create Quests"
              description="Break your goals into epic main quests, quick side quests, and big boss battles."
            />
            <ProcessStepCard 
              number={2}
              icon={Calendar}
              title="Build Habits"
              description="Stay consistent with daily habits and watch your streaks grow."
            />
            <ProcessStepCard 
              number={3}
              icon={Coins}
              title="Earn XP and Coins"
              description="Complete tasks to level up and earn coins to spend in the shop."
            />
            <ProcessStepCard 
              number={4}
              icon={Shield}
              title="Equip Gear"
              description="Reward yourself with armor, weapons, or real-life perks — all tracked in your inventory."
            />
            <ProcessStepCard 
              number={5}
              icon={Brain}
              title="Unlock Skills"
              description="Build your skill tree and craft your own character progression."
            />
            <ProcessStepCard 
              number={6}
              icon={TrendingUp}
              title="Track Progress"
              description="Watch yourself evolve with detailed stats and progress tracking."
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Feature Grid */}
      <section className="py-20 relative" id="features">
        <FloatingParticles count={30} />
        <div className="container mx-auto px-4">
          <SectionTitle icon={Sparkles}>Features</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="bg-rpg-tan/30 py-20 relative" id="why">
        <FloatingParticles count={20} />
        <div className="container mx-auto px-4">
          <SectionTitle icon={Heart}>Why Life Quest?</SectionTitle>
          
          <PixelCard className="max-w-3xl mx-auto shadow-[0_0_30px_rgba(var(--rpg-gold-rgb)/0.1)] bg-rpg-cream/90 
                           transition-all hover:shadow-[0_0_40px_rgba(var(--rpg-gold-rgb)/0.15)]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="bg-rpg-brown rounded-full p-3 shadow-md">
                <Heart className="h-8 w-8 text-rpg-gold" />
              </div>
            </div>
            
            <ul className="space-y-6 mt-6">
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
          </PixelCard>
        </div>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-20 relative">
        <FloatingParticles count={40} />
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-3xl text-rpg-brown mb-8">
            Ready to Start Your Adventure?
          </h2>
          <PixelButton 
            onClick={() => navigate("/signup")}
            className="animate-pulse-gentle"
          >
            Start Questing
          </PixelButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rpg-brown/10 py-8">
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
