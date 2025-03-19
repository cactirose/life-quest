
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGameData, SkillNode } from "@/contexts/DataContext";
import { toast } from "sonner";
import { 
  GitBranch, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  MoveHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Skill node form component
const SkillNodeForm = ({
  onSubmit,
  initialData = null,
  onCancel,
  availableNodes
}: {
  onSubmit: (node: Omit<SkillNode, "id">) => void;
  initialData?: Partial<SkillNode> | null;
  onCancel: () => void;
  availableNodes: SkillNode[];
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "🌟");
  const [position, setPosition] = useState(initialData?.position || { x: 400, y: 300 });
  const [connectedTo, setConnectedTo] = useState<string[]>(initialData?.connectedTo || []);
  const [unlocked, setUnlocked] = useState(initialData?.unlocked || false);
  const [statBonuses, setStatBonuses] = useState(initialData?.statBonuses || {});

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    onSubmit({
      name,
      description,
      icon,
      position,
      connectedTo,
      unlocked,
      statBonuses
    });
  };

  const handleStatChange = (stat: string, value: number) => {
    setStatBonuses(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
  };

  const toggleConnection = (nodeId: string) => {
    setConnectedTo(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // Common emoji options for skills
  const commonIcons = ["🌟", "⚔️", "🛡️", "📚", "💪", "🧠", "🏃", "🌱", "🎯", "🔍", "🧙", "⚡", "🧘", "🎨", "💼", "💻", "🧪", "🌌"];

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
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this skill represents"
          rows={3}
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
        <label className="block text-sm font-medium mb-1">
          Position
        </label>
        <div className="flex gap-2">
          <div>
            <span className="text-xs">X</span>
            <Input
              type="number"
              value={position.x}
              onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
              className="w-24"
            />
          </div>
          <div>
            <span className="text-xs">Y</span>
            <Input
              type="number"
              value={position.y}
              onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center text-sm font-medium mb-1">
          <input
            type="checkbox"
            checked={unlocked}
            onChange={(e) => setUnlocked(e.target.checked)}
            className="mr-2"
          />
          Unlocked from start
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Connect to Other Skills
        </label>
        {availableNodes.length > 0 ? (
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            {availableNodes
              .filter(node => node.id !== initialData?.id)
              .map(node => (
                <div key={node.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`connect-${node.id}`}
                    checked={connectedTo.includes(node.id)}
                    onChange={() => toggleConnection(node.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`connect-${node.id}`} className="text-sm">
                    {node.name} {node.icon}
                  </label>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No other skills available</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Stat Bonuses When Unlocked
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => (
            <div key={stat} className="flex items-center gap-2">
              <span className="text-sm capitalize w-20">{stat}</span>
              <Input
                type="number"
                min="0"
                max="5"
                value={statBonuses[stat] || 0}
                onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                className="w-16"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
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

// Skill Tree Canvas
const SkillTreeCanvas = ({
  nodes,
  onNodeClick,
  onNodeEdit,
  onNodeDelete,
  onNodeUnlock
}: {
  nodes: SkillNode[];
  onNodeClick: (node: SkillNode) => void;
  onNodeEdit: (node: SkillNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeUnlock: (nodeId: string) => void;
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle zooming
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Determine if a node can be unlocked
  const canUnlockNode = (node: SkillNode): boolean => {
    if (node.unlocked) return false;
    
    // If the node has no connections, it can't be unlocked
    if (node.connectedTo.length === 0) return false;
    
    // Check if at least one connected node is unlocked
    return node.connectedTo.some(connectedId => {
      const connectedNode = nodes.find(n => n.id === connectedId);
      return connectedNode?.unlocked || false;
    });
  };

  // Draw the edges between nodes
  const renderEdges = () => {
    const connections: JSX.Element[] = [];
    
    nodes.forEach(sourceNode => {
      sourceNode.connectedTo.forEach(targetId => {
        const targetNode = nodes.find(node => node.id === targetId);
        if (!targetNode) return;
        
        const sourceX = sourceNode.position.x;
        const sourceY = sourceNode.position.y;
        const targetX = targetNode.position.x;
        const targetY = targetNode.position.y;
        
        // Determine if the edge should be active (both nodes unlocked)
        const isActive = sourceNode.unlocked && targetNode.unlocked;
        
        connections.push(
          <div
            key={`${sourceNode.id}-${targetId}`}
            className={`skill-edge absolute ${isActive ? 'active' : ''}`}
            style={{
              width: Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)),
              height: 0,
              transform: `translate(${sourceX}px, ${sourceY}px) rotate(${Math.atan2(targetY - sourceY, targetX - sourceX)}rad)`,
              transformOrigin: '0 0'
            }}
          />
        );
      });
    });
    
    return connections;
  };

  return (
    <div className="relative h-[70vh] overflow-hidden border-4 border-rpg-brown rounded-lg">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white">
          <ZoomIn size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white">
          <ZoomOut size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={handleResetView} className="bg-white">
          <MoveHorizontal size={16} />
        </Button>
      </div>
      
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative bg-rpg-pixel-black cursor-move"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a1887f' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {/* Connections between nodes */}
          {renderEdges()}
          
          {/* Nodes */}
          {nodes.map(node => {
            const canUnlock = canUnlockNode(node);
            
            return (
              <div
                key={node.id}
                className={`skill-node ${node.unlocked ? 'active' : ''}`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                }}
              >
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => onNodeClick(node)}
                >
                  <span className="text-2xl">{node.icon}</span>
                </div>
                
                {/* Node controls that appear on hover */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-6 w-6 bg-white">
                        <MoreHorizontal size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem onClick={() => onNodeEdit(node)}>
                        <Edit size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNodeDelete(node.id)} className="text-destructive">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                      {!node.unlocked && canUnlock && (
                        <DropdownMenuItem onClick={() => onNodeUnlock(node.id)}>
                          <Unlock size={14} className="mr-2" /> Unlock
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Node status indicator */}
                {!node.unlocked && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <Lock size={16} className={canUnlock ? "text-green-500" : "text-red-500"} />
                  </div>
                )}
                
                {/* Node name that appears when zoomed in */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-rpg-brown px-2 py-0.5 rounded whitespace-nowrap">
                  {node.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Skill Detail Display
const SkillDetail = ({ 
  node, 
  onEdit, 
  onDelete, 
  onUnlock, 
  canUnlock 
}: { 
  node: SkillNode; 
  onEdit: (node: SkillNode) => void;
  onDelete: (nodeId: string) => void;
  onUnlock: (nodeId: string) => void;
  canUnlock: boolean;
}) => {
  return (
    <div className="parchment">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-rpg-tan border-2 border-rpg-brown rounded-full">
            <span className="text-2xl">{node.icon}</span>
          </div>
          <h3 className="text-xl font-pixel text-rpg-brown">{node.name}</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(node)}
          >
            <Edit size={14} className="mr-1" /> Edit
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(node.id)} 
            className="text-destructive"
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
        </div>
      </div>
      
      <p className="text-rpg-brown mb-4">{node.description}</p>
      
      <div className="mb-4">
        <h4 className="font-pixel text-rpg-brown mb-2">Status</h4>
        {node.unlocked ? (
          <span className="px-2 py-1 bg-rpg-green text-white rounded-full text-xs">
            Unlocked
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-rpg-brown text-white rounded-full text-xs">
              Locked
            </span>
            {canUnlock && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUnlock(node.id)}
                className="ml-2"
              >
                <Unlock size={14} className="mr-1" /> Unlock Now
              </Button>
            )}
          </div>
        )}
      </div>
      
      {Object.keys(node.statBonuses).length > 0 && (
        <div>
          <h4 className="font-pixel text-rpg-brown mb-2">Stat Bonuses</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(node.statBonuses).map(([stat, value]) => (
              value > 0 && (
                <div key={stat} className="flex justify-between items-center px-3 py-1 bg-rpg-tan/50 rounded">
                  <span className="text-sm capitalize text-rpg-brown">{stat}</span>
                  <span className="font-pixel text-rpg-green">+{value}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SkillTree = () => {
  const { 
    skillTree, 
    addSkillNode, 
    updateSkillNode, 
    deleteSkillNode, 
    unlockSkillNode 
  } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<SkillNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  
  // Handle adding a new node
  const handleAddNode = (node: Omit<SkillNode, "id">) => {
    addSkillNode(node);
    setShowAddDialog(false);
    toast.success("Skill added successfully!");
  };
  
  // Handle editing a node
  const handleEditNode = (updatedNode: Omit<SkillNode, "id">) => {
    if (!editingNode) return;
    
    const node = {
      ...editingNode,
      ...updatedNode
    };
    
    updateSkillNode(node);
    setEditingNode(null);
    
    // Update selected node if it's the one being edited
    if (selectedNode?.id === node.id) {
      setSelectedNode(node);
    }
    
    toast.success("Skill updated successfully!");
  };
  
  // Handle deleting a node
  const handleDeleteNode = (nodeId: string) => {
    deleteSkillNode(nodeId);
    
    // Clear selected node if it's the one being deleted
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    
    toast.success("Skill deleted successfully!");
  };
  
  // Handle unlocking a node
  const handleUnlockNode = (nodeId: string) => {
    unlockSkillNode(nodeId);
    
    // Update the selected node if it's the one being unlocked
    const node = skillTree.find(n => n.id === nodeId);
    if (node && selectedNode?.id === nodeId) {
      setSelectedNode({
        ...node,
        unlocked: true
      });
    }
    
    toast.success("Skill unlocked successfully!");
  };
  
  // Handle node click
  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };
  
  // Check if a node can be unlocked
  const canUnlockNode = (node: SkillNode): boolean => {
    if (node.unlocked) return false;
    
    // If the node has no connections, it can't be unlocked
    if (node.connectedTo.length === 0) return false;
    
    // Check if at least one connected node is unlocked
    return node.connectedTo.some(connectedId => {
      const connectedNode = skillTree.find(n => n.id === connectedId);
      return connectedNode?.unlocked || false;
    });
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <GitBranch size={24} className="text-rpg-brown" />
          <h1 className="text-3xl font-pixel text-rpg-brown">Skill Tree</h1>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="pixel-button"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Skill
          </Button>
          
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Add New Skill</DialogTitle>
            </DialogHeader>
            <SkillNodeForm 
              onSubmit={handleAddNode} 
              onCancel={() => setShowAddDialog(false)}
              availableNodes={skillTree}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Node Dialog */}
        <Dialog 
          open={!!editingNode} 
          onOpenChange={(open) => !open && setEditingNode(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Skill</DialogTitle>
            </DialogHeader>
            {editingNode && (
              <SkillNodeForm 
                initialData={editingNode}
                onSubmit={handleEditNode} 
                onCancel={() => setEditingNode(null)}
                availableNodes={skillTree}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {skillTree.length === 0 ? (
            <div className="parchment h-[70vh] flex flex-col items-center justify-center">
              <GitBranch size={48} className="mb-4 text-rpg-brown" />
              <h2 className="text-xl font-pixel text-rpg-brown mb-2">Your Skill Tree is Empty</h2>
              <p className="text-rpg-brown mb-4 text-center max-w-md">
                Add your first skill to start building your unique skill tree. Skills can represent abilities, 
                habits, or achievements you want to track.
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="pixel-button"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Your First Skill
              </Button>
            </div>
          ) : (
            <SkillTreeCanvas
              nodes={skillTree}
              onNodeClick={handleNodeClick}
              onNodeEdit={setEditingNode}
              onNodeDelete={handleDeleteNode}
              onNodeUnlock={handleUnlockNode}
            />
          )}
        </div>
        
        <div>
          {selectedNode ? (
            <SkillDetail
              node={selectedNode}
              onEdit={setEditingNode}
              onDelete={handleDeleteNode}
              onUnlock={handleUnlockNode}
              canUnlock={canUnlockNode(selectedNode)}
            />
          ) : (
            <div className="parchment">
              <h2 className="text-xl font-pixel text-rpg-brown mb-4">Skill Tree Guide</h2>
              <p className="text-rpg-brown mb-4">
                Select any skill in the tree to view its details. Your skill tree represents your 
                character's progression path.
              </p>
              
              <div className="space-y-4">
                <div className="wood-texture p-3">
                  <h3 className="text-lg font-pixel text-rpg-brown mb-2">Controls</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ZoomIn size={16} className="text-rpg-brown" />
                      <span>Zoom In - Enlarge the view</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ZoomOut size={16} className="text-rpg-brown" />
                      <span>Zoom Out - Reduce the view</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MoveHorizontal size={16} className="text-rpg-brown" />
                      <span>Reset View - Return to default view</span>
                    </li>
                  </ul>
                </div>
                
                <div className="wood-texture p-3">
                  <h3 className="text-lg font-pixel text-rpg-brown mb-2">Legend</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-rpg-light-green"></div>
                      <span>Unlocked Skills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-rpg-tan"></div>
                      <span>Locked Skills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock size={16} className="text-green-500" />
                      <span>Available to Unlock</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock size={16} className="text-red-500" />
                      <span>Requirements Not Met</span>
                    </li>
                  </ul>
                </div>
                
                <div className="wood-texture p-3">
                  <h3 className="text-lg font-pixel text-rpg-brown mb-2">Tips</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Click and drag to move around the skill tree</li>
                    <li>• Click on a skill to view its details</li>
                    <li>• Connect skills to create progression paths</li>
                    <li>• Unlock skills to gain stat bonuses</li>
                    <li>• Customize your tree however you want</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTree;
