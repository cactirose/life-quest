import { useState } from "react";
import { useGrowthSystem, SkillProgress, SkillDefinition } from "@/hooks/useGrowthSystem";
import { SkillName, SKILL_DEFINITIONS } from "@/types/skills";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { GitBranch, TrendingUp, Edit2, Trash2, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SkillFormData {
  name: string;
  description: string;
  primaryStat: string;
  icon?: string;
}

const SkillCard = ({ 
  skillName,
  isManaging,
  onEdit,
  onDelete 
}: { 
  skillName: SkillName;
  isManaging: boolean;
  onEdit: (skill: SkillDefinition) => void;
  onDelete: (skillName: SkillName) => void;
}) => {
  const { getSkillProgress } = useGrowthSystem();
  const skillInfo = getSkillProgress(skillName);
  const definition = SKILL_DEFINITIONS[skillName];

  if (!skillInfo || !definition) return null;

  return (
    <Card className="p-4 bg-rpg-tan hover:bg-rpg-tan/90 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-rpg-brown flex items-center justify-center text-white">
            {/* Display first letter of skill name as fallback */}
            {definition.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-pixel text-lg capitalize">{definition.name}</h3>
            <p className="text-xs text-rpg-brown">Level {skillInfo.level}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isManaging ? (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(definition)}
                className="p-1 rounded bg-rpg-brown text-white hover:bg-rpg-brown/80"
                title="Edit skill"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(skillName)}
                className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                title="Delete skill"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : null}
          <div className="px-2 py-1 bg-rpg-brown text-white text-xs rounded">
            +{Math.floor(skillInfo.level / 2)} {definition.primaryStat.toUpperCase()}
          </div>
        </div>
      </div>

      <p className="text-sm text-rpg-brown my-2">{definition.description}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>XP: {skillInfo.xp}</span>
          <span>{skillInfo.nextLevelXP}</span>
        </div>
        <Progress value={skillInfo.progress * 100} className="h-2" />
      </div>
    </Card>
  );
};

const GrowthTree = () => {
  const { isLoading, error, addSkill, updateSkill, deleteSkill } = useGrowthSystem();
  const [filter, setFilter] = useState<'all' | 'attributes' | 'skills'>('all');
  const [isManaging, setIsManaging] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const skillGroups = {
    attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    skills: ['crafting', 'cooking', 'gardening', 'fitness', 'meditation', 'learning']
  };

  const filteredSkills = filter === 'all' 
    ? [...skillGroups.attributes, ...skillGroups.skills]
    : skillGroups[filter === 'attributes' ? 'attributes' : 'skills'];

  const handleAddSkill = async (data: SkillFormData) => {
    setIsProcessing(true);
    try {
      const result = await addSkill(data);
      if (result) {
        setIsDialogOpen(false);
        toast.success(`Added new skill: ${data.name}`);
      } else {
        throw new Error("Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSkill = async (data: SkillFormData) => {
    if (!editingSkill) return;
    
    setIsProcessing(true);
    try {
      const result = await updateSkill(editingSkill.name as SkillName, data);
      if (result) {
        setEditingSkill(null);
        setIsDialogOpen(false);
        toast.success(`Updated skill: ${data.name}`);
      } else {
        throw new Error("Failed to update skill");
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSkill = async (skillName: SkillName) => {
    if (window.confirm(`Are you sure you want to delete ${skillName}?`)) {
      setIsProcessing(true);
      try {
        const result = await deleteSkill(skillName);
        if (result) {
          toast.success(`Deleted skill: ${skillName}`);
        } else {
          throw new Error("Failed to delete skill");
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
        toast.error("Failed to delete skill. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="parchment text-center py-8">
          <h2 className="text-xl font-pixel text-rpg-brown mb-2">Error Loading Skills</h2>
          <p className="text-rpg-brown">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch size={24} className="text-rpg-brown" />
            <h1 className="text-3xl font-pixel text-rpg-brown">Growth Tree</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="manage-mode">Manage Skills</Label>
              <Switch
                id="manage-mode"
                checked={isManaging}
                onCheckedChange={setIsManaging}
                className={cn(
                  isManaging ? "bg-rpg-brown" : "bg-gray-200",
                  "transition-colors"
                )}
              />
            </div>
            {isManaging && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="pixel-button flex items-center gap-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    <span>New Skill</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSkill ? 'Edit Skill' : 'Create New Skill'}
                    </DialogTitle>
                  </DialogHeader>
                  <SkillForm
                    initialData={editingSkill || undefined}
                    onSubmit={editingSkill ? handleEditSkill : handleAddSkill}
                    onClose={() => {
                      setIsDialogOpen(false);
                      setEditingSkill(null);
                    }}
                    isProcessing={isProcessing}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <div className="parchment p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-rpg-green" />
            <h2 className="font-pixel text-rpg-brown">The Skill Tree has evolved!</h2>
          </div>
          <p className="text-sm text-rpg-brown">
            Track your growth through skills and stats below. Each skill level contributes to your character's attributes,
            making you stronger as you progress.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('attributes')}
            className={`px-4 py-2 rounded ${
              filter === 'attributes' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            Attributes
          </button>
          <button
            onClick={() => setFilter('skills')}
            className={`px-4 py-2 rounded ${
              filter === 'skills' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            Skills
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skillName) => (
          <SkillCard
            key={skillName}
            skillName={skillName as SkillName}
            isManaging={isManaging}
            onEdit={(skill) => {
              setEditingSkill(skill);
              setIsDialogOpen(true);
            }}
            onDelete={handleDeleteSkill}
          />
        ))}
      </div>
    </div>
  );
};

// Update the SkillForm to handle processing state
const SkillForm = ({
  initialData,
  onSubmit,
  onClose,
  isProcessing = false
}: {
  initialData?: SkillFormData;
  onSubmit: (data: SkillFormData) => void;
  onClose: () => void;
  isProcessing?: boolean;
}) => {
  const [formData, setFormData] = useState<SkillFormData>(
    initialData || {
      name: '',
      description: '',
      primaryStat: 'strength',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryStat">Primary Stat</Label>
        <Select
          value={formData.primaryStat}
          onValueChange={(value) => setFormData(prev => ({ ...prev, primaryStat: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a stat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="dexterity">Dexterity</SelectItem>
            <SelectItem value="constitution">Constitution</SelectItem>
            <SelectItem value="intelligence">Intelligence</SelectItem>
            <SelectItem value="wisdom">Wisdom</SelectItem>
            <SelectItem value="charisma">Charisma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {initialData ? 'Update' : 'Create'} Skill
        </Button>
      </div>
    </form>
  );
};

export default GrowthTree;
