
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Edit, Trash2, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";

interface JSFunction {
  id: number;
  name: string;
  description: string;
  arguments: { name: string; type: string; dataType: string; }[];
  returnEnabled: boolean;
  returnType?: string;
  code: string;
}

const JSModules = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [functions, setFunctions] = useState<JSFunction[]>([]);

  useEffect(() => {
    const storedFunctions = storage.getJSFunctions();
    setFunctions(storedFunctions);
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentFunction, setCurrentFunction] = useState<Omit<JSFunction, 'id'>>({
    name: '',
    description: '',
    arguments: [],
    returnEnabled: false,
    returnType: undefined,
    code: ''
  });

  const [newArgument, setNewArgument] = useState({ name: '', type: 'String', dataType: 'String' });

  const dataTypes = ['String', 'Number', 'Map', 'List'];

  const handleSaveFunction = () => {
    if (!currentFunction.name.trim()) {
      toast({
        title: "Error",
        description: "Function name is required",
        variant: "destructive"
      });
      return;
    }

    if (!currentFunction.description.trim()) {
      toast({
        title: "Error", 
        description: "Function description is required",
        variant: "destructive"
      });
      return;
    }

    if (!currentFunction.code.trim()) {
      toast({
        title: "Error", 
        description: "Function code is required",
        variant: "destructive"
      });
      return;
    }

    let updatedFunctions;
    if (isEditing && editingId !== null) {
      updatedFunctions = functions.map(func => 
        func.id === editingId 
          ? { ...currentFunction, id: editingId }
          : func
      );
      toast({
        title: "Success",
        description: "Function updated successfully"
      });
    } else {
      const newFunction = { ...currentFunction, id: Date.now() };
      updatedFunctions = [...functions, newFunction];
      toast({
        title: "Success",
        description: "Function created successfully"
      });
    }

    setFunctions(updatedFunctions);
    storage.saveJSFunctions(updatedFunctions);
    resetForm();
  };

  const handleEditFunction = (func: JSFunction) => {
    setCurrentFunction({
      name: func.name,
      description: func.description,
      arguments: func.arguments,
      returnEnabled: func.returnEnabled,
      returnType: func.returnType,
      code: func.code || ''
    });
    setIsEditing(true);
    setEditingId(func.id);
    setIsDialogOpen(true);
  };

  const handleDeleteFunction = (id: number) => {
    const updatedFunctions = functions.filter(func => func.id !== id);
    setFunctions(updatedFunctions);
    storage.saveJSFunctions(updatedFunctions);
    toast({
      title: "Success",
      description: "Function deleted successfully"
    });
  };

  const resetForm = () => {
    setCurrentFunction({
      name: '',
      description: '',
      arguments: [],
      returnEnabled: false,
      returnType: undefined,
      code: ''
    });
    setNewArgument({ name: '', type: 'String', dataType: 'String' });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const addArgument = () => {
    if (!newArgument.name.trim()) return;
    
    setCurrentFunction({
      ...currentFunction,
      arguments: [...currentFunction.arguments, { ...newArgument }]
    });
    setNewArgument({ name: '', type: 'String', dataType: 'String' });
  };

  const removeArgument = (index: number) => {
    setCurrentFunction({
      ...currentFunction,
      arguments: currentFunction.arguments.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">JS Modules</h1>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Function</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">JavaScript Functions</h2>
          <p className="text-gray-600">Manage your reusable JavaScript functions</p>
        </div>

        {functions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Code className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No functions yet</h3>
                <p className="text-gray-500 max-w-md">
                  Create your first JavaScript function to use in your pipelines
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Function
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {functions.map((func) => (
              <Card key={func.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{func.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditFunction(func)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteFunction(func.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{func.description}</p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Arguments:</span>
                      {func.arguments.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          {func.arguments.map((arg, index) => (
                            <div key={index} className="text-gray-600">
                              {arg.name} ({arg.dataType || arg.type})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 mt-1">None</div>
                      )}
                    </div>
                    {func.returnEnabled && (
                      <div>
                        <span className="font-medium text-gray-700">Returns:</span>
                        <span className="text-gray-600 ml-2">{func.returnType}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Function Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Function' : 'Add New Function'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="functionName">Function Name</Label>
                <Input
                  id="functionName"
                  value={currentFunction.name}
                  onChange={(e) => setCurrentFunction({...currentFunction, name: e.target.value})}
                  placeholder="Enter function name"
                />
              </div>

              <div>
                <Label htmlFor="functionDescription">Description</Label>
                <Textarea
                  id="functionDescription"
                  value={currentFunction.description}
                  onChange={(e) => setCurrentFunction({...currentFunction, description: e.target.value})}
                  placeholder="Describe what this function does"
                  rows={3}
                />
              </div>

              <div>
                <Label>Arguments</Label>
                <div className="space-y-2 mt-2">
                  {currentFunction.arguments.map((arg, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{arg.name} ({arg.dataType || arg.type})</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeArgument(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={newArgument.name}
                      onChange={(e) => setNewArgument({...newArgument, name: e.target.value})}
                      placeholder="Argument name"
                      className="flex-1"
                    />
                    <Select 
                      value={newArgument.dataType} 
                      onValueChange={(value) => setNewArgument({...newArgument, dataType: value, type: value})}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {dataTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addArgument} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="returnEnabled"
                  checked={currentFunction.returnEnabled}
                  onChange={(e) => setCurrentFunction({
                    ...currentFunction, 
                    returnEnabled: e.target.checked,
                    returnType: e.target.checked ? 'String' : undefined
                  })}
                />
                <Label htmlFor="returnEnabled">Enable Return Value</Label>
              </div>

              {currentFunction.returnEnabled && (
                <div>
                  <Label>Return Type</Label>
                  <Select 
                    value={currentFunction.returnType || 'String'} 
                    onValueChange={(value) => setCurrentFunction({...currentFunction, returnType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {dataTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="functionCode">Function Code</Label>
                <Textarea
                  id="functionCode"
                  value={currentFunction.code}
                  onChange={(e) => setCurrentFunction({...currentFunction, code: e.target.value})}
                  placeholder="function functionName(args) {&#10;  // Your code here&#10;  return result;&#10;}"
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveFunction} className="flex-1">
                  {isEditing ? 'Update' : 'Create'} Function
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JSModules;
