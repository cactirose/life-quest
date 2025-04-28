import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MessageSquare, Users } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-rpg-parchment to-rpg-tan/20 p-0">
      <div className="w-full flex flex-col justify-center items-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-rpg text-rpg-brown mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-rpg-brown/80 mb-8">
            Join thousands of adventurers on their quest for productivity
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate("/signup")}
              className="pixel-button text-lg font-medium text-secondary bg-primary px-8 py-6"
            >
              Start Questing
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {/* Footer */}
      <footer className="border-t border-rpg-brown/20 w-full mt-0">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 px-4 py-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/feedback" 
              className="text-rpg-brown/80 hover:text-rpg-brown transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </Link>
            <Link 
              to="/community" 
              className="text-rpg-brown/80 hover:text-rpg-brown transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Join Community</span>
            </Link>
            <a
              href="https://ephnystudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rpg-brown/80 hover:text-rpg-brown transition-colors flex items-center gap-2"
            >
              <span>Designed By Ephny Studio</span>
            </a>
          </div>
          <div className="text-rpg-brown/60 text-sm">
            © {new Date().getFullYear()} Life Quest. All rights reserved.
          </div>
        </div>
      </footer>
    </section>
  );
} 