
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowLeft, Edit, Trash2, Code, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FunctionArgument {
  name: string;
  type: string;
}

interface JSFunction {
  name: string;
  arguments: FunctionArgument[];
  returnEnabled: boolean;
  returnType: string;
  code: string;
}

const JSModules = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newFunction, setNewFunction] = useState({
    name: '',
    arguments: [] as FunctionArgument[],
    returnEnabled: false,
    returnType: 'String',
    code: ''
  });

  const [functions, setFunctions] = useState<JSFunction[]>([
    {
      name: 'calculateTotal',
      arguments: [
        { name: 'price', type: 'Number' },
        { name: 'quantity', type: 'Number' },
        { name: 'tax', type: 'Number' }
      ],
      returnEnabled: true,
      returnType: 'Number',
      code: 'return price * quantity * (1 + tax);'
    },
    {
      name: 'validateEmail',
      arguments: [
        { name: 'email', type: 'String' }
      ],
      returnEnabled: true,
      returnType: 'String',
      code: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nreturn emailRegex.test(email) ? "valid" : "invalid";'
    },
    {
      name: 'logMessage',
      arguments: [
        { name: 'message', type: 'String' },
        { name: 'level', type: 'String' }
      ],
      returnEnabled: false,
      returnType: 'String',
      code: 'console.log(`[${level}] ${message}`);'
    }
  ]);

  const addArgument = () => {
    setNewFunction({
      ...newFunction,
      arguments: [...newFunction.arguments, { name: '', type: 'String' }]
    });
  };

  const removeArgument = (index: number) => {
    setNewFunction({
      ...newFunction,
      arguments: newFunction.arguments.filter((_, i) => i !== index)
    });
  };

  const updateArgument = (index: number, field: 'name' | 'type', value: string) => {
    const updatedArgs = [...newFunction.arguments];
    updatedArgs[index] = { ...updatedArgs[index], [field]: value };
    setNewFunction({ ...newFunction, arguments: updatedArgs });
  };

  const handleAddFunction = () => {
    if (newFunction.name && newFunction.code) {
      setFunctions([...functions, { ...newFunction }]);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditFunction = (index: number) => {
    const func = functions[index];
    setNewFunction({ ...func });
    setEditingIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFunction = () => {
    if (editingIndex !== null && newFunction.name && newFunction.code) {
      const updatedFunctions = [...functions];
      updatedFunctions[editingIndex] = { ...newFunction };
      setFunctions(updatedFunctions);
      resetForm();
      setIsEditDialogOpen(false);
      setEditingIndex(null);
    }
  };

  const handleDeleteFunction = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNewFunction({
      name: '',
      arguments: [],
      returnEnabled: false,
      returnType: 'String',
      code: ''
    });
  };

  const renderFunctionDialog = (isEdit: boolean) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Function' : 'Add New Function'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="functionName">Function Name</Label>
          <Input
            id="functionName"
            value={newFunction.name}
            onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
            placeholder="e.g., calculateTotal"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Arguments</Label>
            <Button type="button" size="sm" onClick={addArgument} className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Argument</span>
            </Button>
          </div>
          {newFunction.arguments.map((arg, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                placeholder="Argument name"
                value={arg.name}
                onChange={(e) => updateArgument(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Select value={arg.type} onValueChange={(value) => updateArgument(index, 'type', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Number">Number</SelectItem>
                  <SelectItem value="Map">Map</SelectItem>
                  <SelectItem value="List">List</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeArgument(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={newFunction.returnEnabled}
            onCheckedChange={(checked) => setNewFunction({...newFunction, returnEnabled: checked})}
          />
          <Label>Enable Return Type</Label>
        </div>

        {newFunction.returnEnabled && (
          <div>
            <Label htmlFor="returnType">Return Type</Label>
            <Select 
              value={newFunction.returnType} 
              onValueChange={(value) => setNewFunction({...newFunction, returnType: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Map">Map</SelectItem>
                <SelectItem value="List">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="code">JavaScript Code</Label>
          <Textarea
            id="code"
            value={newFunction.code}
            onChange={(e) => setNewFunction({...newFunction, code: e.target.value})}
            placeholder="Enter your JavaScript code here..."
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (isEdit) {
                setIsEditDialogOpen(false);
                setEditingIndex(null);
              } else {
                setIsAddDialogOpen(false);
              }
              resetForm();
            }} 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={isEdit ? handleUpdateFunction : handleAddFunction} 
            className="flex-1"
          >
            {isEdit ? 'Update Function' : 'Add Function'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

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
              <h1 className="text-2xl font-bold text-gray-900">JavaScript Modules</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Function</span>
                </Button>
              </DialogTrigger>
              {renderFunctionDialog(false)}
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map((func, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    <span>{func.name}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditFunction(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteFunction(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Arguments</Label>
                    <div className="mt-1 space-y-1">
                      {func.arguments.length > 0 ? (
                        func.arguments.map((arg, argIndex) => (
                          <div key={argIndex} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {arg.name} ({arg.type})
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">No arguments</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Return Type</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {func.returnEnabled ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {func.returnType}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          No return
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Function Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          {renderFunctionDialog(true)}
        </Dialog>
      </div>
    </div>
  );
};

export default JSModules;
