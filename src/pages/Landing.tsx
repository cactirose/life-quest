
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
  ChevronDown,
  Sword,
  Coins,
  Shield,
  Dna,
  Gamepad2,
  StarIcon,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";

// Enhanced feature card with hover effects and animations
const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <div className="group bg-rpg-tan/50 rounded-lg p-6 flex flex-col items-center text-center transition-all hover:transform hover:scale-[1.02] hover:shadow-xl hover:bg-rpg-tan/60">
    <div className="h-16 w-16 rounded-full bg-rpg-brown flex items-center justify-center mb-4 shadow-md transition-all group-hover:shadow-[0_0_20px_rgba(var(--rpg-gold-rgb)/0.5)]">
      <Icon className="h-8 w-8 text-rpg-tan transition-all group-hover:scale-110 group-hover:text-rpg-gold" />
    </div>
    <h3 className="font-pixel text-lg text-rpg-brown mb-2">{title}</h3>
    <p className="text-rpg-brown/80 text-sm">{description}</p>
  </div>
);

// Enhanced process step cards with grid layout
const ProcessStep = ({ number, title, description, icon: Icon }: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card className="group flex flex-col items-center p-5 rounded-lg transition-all hover:transform hover:scale-[1.01] hover:shadow-lg bg-rpg-tan/30 border-rpg-brown/20">
    <div className="h-16 w-16 rounded-full bg-rpg-brown flex-shrink-0 flex items-center justify-center font-pixel text-rpg-tan group-hover:shadow-[0_0_15px_rgba(var(--rpg-gold-rgb)/0.4)] mb-4">
      <Icon className="h-8 w-8 text-rpg-gold" />
    </div>
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-rpg-brown mb-3 flex items-center justify-center text-rpg-tan font-pixel">
      {number}
    </div>
    <h3 className="font-pixel text-lg text-rpg-brown mb-1 text-center">{title}</h3>
    <p className="text-rpg-brown/80 text-center">{description}</p>
  </Card>
);

// Enhanced section divider with animated sparkles
const SectionDivider = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-24 h-px bg-rpg-brown/20" />
    <div className="relative">
      <Sparkles className="h-6 w-6 text-rpg-gold mx-4 animate-pulse-gentle" />
      <div className="absolute inset-0 bg-rpg-gold/10 blur-md rounded-full animate-pulse opacity-70"></div>
    </div>
    <div className="w-24 h-px bg-rpg-brown/20" />
  </div>
);

// Floating particles component for background effects
const FloatingParticles = ({ count = 20 }: { count?: number }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div 
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            background: 'var(--rpg-gold)',
            borderRadius: '50%',
            opacity: 0.4,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
          className="animate-float"
        />
      ))}
    </div>
  );
};

// Parallax stars background component
const ParallaxStars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--rpg-gold)_1px,_transparent_1px)] [background-size:20px_20px] opacity-[0.05] animate-[pulse_15s_ease-in-out_infinite]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--rpg-gold)_1px,_transparent_1px)] [background-size:30px_30px] opacity-[0.03] animate-[pulse_20s_ease-in-out_infinite_reverse]" style={{ animationDelay: '-5s' }} />
  </div>
);

// Main Landing component
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
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <ParallaxStars />
        <FloatingParticles count={30} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-rpg-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-72 w-72 bg-rpg-brown/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 h-80 w-80 bg-rpg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-1 text-left md:text-center lg:text-left">
              <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-rpg-brown mb-6 [text-shadow:2px_2px_0px_rgba(var(--rpg-gold-rgb)/0.3)] leading-tight animate-fade-in">
                Gamify Your Life.<br />
                Become the Hero<br />of Your Own Story.
              </h1>
              <p className="text-xl text-rpg-brown/80 mb-8 max-w-2xl animate-fade-in" style={{animationDelay: '0.2s'}}>
                Turn your real-world habits, goals, and routines into quests. Build your character, 
                unlock achievements, and level up — all by living with purpose.
              </p>
              <Button 
                size="lg"
                className="font-pixel text-lg px-8 py-7 relative overflow-hidden group shadow-lg animate-fade-in"
                style={{animationDelay: '0.4s'}}
                onClick={() => navigate("/signup")}
              >
                <span className="relative z-10 flex items-center">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Start Your Quest
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rpg-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-rpg-gold/20 group-hover:opacity-0 transition-opacity" />
              </Button>
            </div>
            
            {/* Hero Illustration */}
            <div className="flex-1 relative h-64 md:h-96 w-full max-w-md mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-contain bg-center bg-no-repeat filter drop-shadow-xl">
                {/* This would be replaced with an actual hero illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sword className="h-24 w-24 text-rpg-gold/70 animate-pulse-gentle" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce" onClick={() => scrollToSection('how-it-works')}>
            <ChevronDown className="h-8 w-8 text-rpg-brown/70" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Enhanced How It Works Section */}
      <section className="bg-rpg-tan/20 py-24 relative" id="how-it-works">
        <FloatingParticles count={10} />
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-rpg-gold" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ProcessStep 
              number={1}
              title="Create Quests"
              description="Break your goals into epic main quests, quick side quests, and big boss battles."
              icon={ScrollText}
            />
            <ProcessStep 
              number={2}
              title="Build Habits"
              description="Stay consistent with daily habits and watch your streaks grow."
              icon={Brain}
            />
            <ProcessStep 
              number={3}
              title="Earn XP and Coins"
              description="Complete tasks to level up and earn coins to spend in the shop."
              icon={Coins}
            />
            <ProcessStep 
              number={4}
              title="Equip Gear"
              description="Reward yourself with armor, weapons, or real-life perks — all tracked in your inventory."
              icon={Shield}
            />
            <ProcessStep 
              number={5}
              title="Evolve Your Character"
              description="Customize your skills, track attributes like strength and wisdom, and become your ideal future self."
              icon={Dna}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Enhanced Features Section */}
      <section className="py-24 relative" id="features">
        <FloatingParticles count={15} />
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-rpg-gold" />
            Features
          </h2>
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

      {/* Enhanced Why Life Quest Section */}
      <section className="bg-rpg-tan/20 py-24 relative" id="why">
        <FloatingParticles count={10} />
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-3xl text-rpg-brown text-center mb-8 flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-rpg-gold fill-rpg-gold" />
            Why Life Quest?
          </h2>
          
          <div className="max-w-3xl mx-auto bg-rpg-cream rounded-lg p-8 shadow-[0_0_40px_rgba(var(--rpg-gold-rgb)/0.15)] transition-all hover:shadow-[0_0_50px_rgba(var(--rpg-gold-rgb)/0.2)] border border-rpg-brown/10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rpg-brown/10 via-rpg-gold/30 to-rpg-brown/10"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-dashed border-rpg-gold/20 rounded pointer-events-none"></div>
            
            <div className="relative z-10">
              <ul className="space-y-6">
                <li className="flex items-center gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                    <div className="absolute inset-0 bg-rpg-gold/20 rounded-full blur-sm animate-pulse-gentle"></div>
                  </div>
                  <span className="text-rpg-brown text-lg">Built by someone with no coding experience — truly for everyone</span>
                </li>
                <li className="flex items-center gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                    <div className="absolute inset-0 bg-rpg-gold/20 rounded-full blur-sm animate-pulse-gentle"></div>
                  </div>
                  <span className="text-rpg-brown text-lg">Inspired by RPGs and habit systems that actually stick</span>
                </li>
                <li className="flex items-center gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                    <div className="absolute inset-0 bg-rpg-gold/20 rounded-full blur-sm animate-pulse-gentle"></div>
                  </div>
                  <span className="text-rpg-brown text-lg">Design your own skills, achievements, and rewards</span>
                </li>
                <li className="flex items-center gap-3 hover:transform hover:translate-x-1 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 text-rpg-gold flex-shrink-0" />
                    <div className="absolute inset-0 bg-rpg-gold/20 rounded-full blur-sm animate-pulse-gentle"></div>
                  </div>
                  <span className="text-rpg-brown text-lg">Fun-first productivity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Enhanced Final CTA Section */}
      <section className="py-24 relative">
        <FloatingParticles count={20} />
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-4xl text-rpg-brown mb-8 [text-shadow:2px_2px_0px_rgba(var(--rpg-gold-rgb)/0.2)]">
            Ready to Start Your Adventure?
          </h2>
          <Button 
            size="lg"
            className="font-pixel text-lg px-10 py-8 relative overflow-hidden group shadow-xl animate-pulse-gentle"
            onClick={() => navigate("/signup")}
          >
            <span className="relative z-10 flex items-center">
              <StarIcon className="mr-2 h-5 w-5" />
              Start Questing
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rpg-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-rpg-brown/10 py-8 border-t border-rpg-brown/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--rpg-gold)_1px,_transparent_1px)] [background-size:20px_20px] opacity-[0.02]" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-rpg-brown/80">Made with</span>
              <Heart className="h-4 w-4 text-rpg-gold fill-rpg-gold animate-pulse" />
              <span className="text-rpg-brown/80">using Lovable + Cursor</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-rpg-brown/80 hover:text-rpg-brown hover:bg-rpg-brown/10 transition-all"
                onClick={() => window.location.href = 'mailto:feedback@lifequest.app'}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Feedback
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-rpg-brown/80 hover:text-rpg-brown hover:bg-rpg-brown/10 transition-all"
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
        className="fixed bottom-8 right-8 bg-rpg-brown text-rpg-tan p-3 rounded-full shadow-lg hover:bg-rpg-brown/90 transition-all opacity-0 translate-y-full pointer-events-none [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:pointer-events-auto z-50"
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
