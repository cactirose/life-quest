
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGameData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";
import { Skill, getSkillLevelAndProgress } from "@/types/skills";

// Skill Card Component
const SkillCard = ({ 
  skill, 
  onEdit, 
  onDelete, 
  onAddXP 
}: { 
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
  onAddXP: (skillId: string, xp: number) => void;
}) => {
  const { level, currentXp, nextLevelXp } = getSkillLevelAndProgress(skill.xp);
  const progress = (currentXp / nextLevelXp) * 100;

  return (
    <motion.div 
      className="parchment p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-full text-2xl bg-secondary/20"
          >
            {skill.icon}
          </div>
          <div>
            <h3 className="text-xl font-pixel text-rpg-brown">{skill.name}</h3>
            <p className="text-sm text-rpg-brown/80">Level {level}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(skill)}
          >
            <Edit size={14} className="mr-1" /> Edit
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(skill.id)} 
            className="text-destructive"
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-rpg-brown">XP: {currentXp}</span>
          <span className="text-rpg-brown">Next Level: {nextLevelXp}</span>
        </div>
        <div className="h-2 bg-rpg-tan rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {skill.description && (
        <p className="text-rpg-brown/80 text-sm mb-4">{skill.description}</p>
      )}

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => onAddXP(skill.id, 10)}
      >
        + Add XP
      </Button>
    </motion.div>
  );
};

// Skill Form Component
const SkillForm = ({
  onSubmit,
  initialData = null,
  onCancel
}: {
  onSubmit: (skill: Omit<Skill, "id" | "createdAt">) => void;
  initialData?: Skill | null;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "🌟");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState(initialData?.color || "#4CAF50");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    onSubmit({
      name,
      icon,
      description,
      color,
      xp: initialData?.xp || 0
    });
  };

  // Common emoji options for skills
  const commonIcons = ["🧠", "⚔️", "🎨", "💪", "🏃", "📚", "🎯", "🔍", "🧘", "💻", "🌱", "⚡"];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Skill Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter skill name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Icon
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonIcons.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`w-8 h-8 flex items-center justify-center text-xl rounded 
                ${icon === emoji ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <Input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="Custom icon (emoji)"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Color
        </label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (Optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this skill represents"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Skill' : 'Create Skill'}
        </Button>
      </div>
    </div>
  );
};

// Add XP Modal
const AddXPModal = ({
  skill,
  onAdd,
  onCancel
}: {
  skill: Skill;
  onAdd: (xp: number) => void;
  onCancel: () => void;
}) => {
  const [xp, setXp] = useState(10);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="xp" className="block text-sm font-medium mb-1">
          XP Amount
        </label>
        <Input
          id="xp"
          type="number"
          min="1"
          value={xp}
          onChange={(e) => setXp(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onAdd(xp)}>
          Add XP
        </Button>
      </div>
    </div>
  );
};

const Skills = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [addingXPSkill, setAddingXPSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle adding a new skill
  const handleAddSkill = async (skillData: Omit<Skill, "id" | "createdAt">) => {
    setIsLoading(true);
    try {
      await addSkill(skillData);
      setShowAddDialog(false);
      toast.success("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle editing a skill
  const handleEditSkill = async (updatedSkill: Omit<Skill, "id" | "createdAt">) => {
    if (!editingSkill) return;
    
    setIsLoading(true);
    try {
      const skill = {
        ...editingSkill,
        ...updatedSkill
      };
      
      await updateSkill(skill);
      setEditingSkill(null);
      toast.success("Skill updated successfully!");
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deleting a skill
  const handleDeleteSkill = async (skillId: string) => {
    setIsLoading(true);
    try {
      await deleteSkill(skillId);
      toast.success("Skill deleted successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding XP to a skill
  const handleAddXP = async (skillId: string, xp: number) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;
    
    setIsLoading(true);
    try {
      await updateSkill({
        ...skill,
        xp: skill.xp + xp
      });
      
      setAddingXPSkill(null);
      toast.success(`Added ${xp} XP to ${skill.name}!`);
    } catch (error) {
      console.error("Error adding XP to skill:", error);
      toast.error("Failed to add XP");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Skills</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="pixel-button"
            disabled={isLoading}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Skill
          </Button>
          
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Add New Skill</DialogTitle>
            </DialogHeader>
            <SkillForm 
              onSubmit={handleAddSkill} 
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Skill Dialog */}
        <Dialog 
          open={!!editingSkill} 
          onOpenChange={(open) => !open && setEditingSkill(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Skill</DialogTitle>
            </DialogHeader>
            {editingSkill && (
              <SkillForm 
                initialData={editingSkill}
                onSubmit={handleEditSkill} 
                onCancel={() => setEditingSkill(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add XP Dialog */}
        <Dialog 
          open={!!addingXPSkill} 
          onOpenChange={(open) => !open && setAddingXPSkill(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Add XP to {addingXPSkill?.name}</DialogTitle>
            </DialogHeader>
            {addingXPSkill && (
              <AddXPModal 
                skill={addingXPSkill}
                onAdd={(xp) => handleAddXP(addingXPSkill.id, xp)}
                onCancel={() => setAddingXPSkill(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.length === 0 ? (
          <div className="col-span-full parchment h-[50vh] flex flex-col items-center justify-center">
            <PlusCircle size={48} className="mb-4 text-rpg-brown" />
            <h2 className="text-xl font-pixel text-rpg-brown mb-2">No Skills Yet</h2>
            <p className="text-rpg-brown mb-4 text-center max-w-md">
              Add your first skill to start tracking your progress. Skills can represent abilities, 
              habits, or achievements you want to develop.
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="pixel-button"
              disabled={isLoading}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          skills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={setEditingSkill}
              onDelete={handleDeleteSkill}
              onAddXP={(skillId) => setAddingXPSkill(skills.find(s => s.id === skillId) || null)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Skills; 
