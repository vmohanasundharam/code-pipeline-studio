
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowLeft, Edit, Trash2, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JSModules = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFunction, setNewFunction] = useState({
    name: '',
    arguments: '',
    returnEnabled: false,
    returnType: 'String',
    code: ''
  });

  const [functions, setFunctions] = useState([
    {
      name: 'calculateTotal',
      arguments: 'price, quantity, tax',
      returnEnabled: true,
      returnType: 'Number',
      code: 'return price * quantity * (1 + tax);'
    },
    {
      name: 'validateEmail',
      arguments: 'email',
      returnEnabled: true,
      returnType: 'String',
      code: 'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nreturn emailRegex.test(email) ? "valid" : "invalid";'
    },
    {
      name: 'logMessage',
      arguments: 'message, level',
      returnEnabled: false,
      returnType: 'String',
      code: 'console.log(`[${level}] ${message}`);'
    }
  ]);

  const handleAddFunction = () => {
    if (newFunction.name && newFunction.code) {
      setFunctions([...functions, { ...newFunction }]);
      setNewFunction({
        name: '',
        arguments: '',
        returnEnabled: false,
        returnType: 'String',
        code: ''
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteFunction = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
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
              <h1 className="text-2xl font-bold text-gray-900">JavaScript Modules</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Function</span>
                </Button>
              </DialogTrigger>
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
                    <Button size="sm" variant="outline">
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
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
                      {func.arguments || 'No arguments'}
                    </p>
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

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Code Preview</Label>
                    <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded mt-1 overflow-x-auto">
                      {func.code.length > 80 ? func.code.substring(0, 80) + '...' : func.code}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Function Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Function</DialogTitle>
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
                <Label htmlFor="arguments">Arguments</Label>
                <Input
                  id="arguments"
                  value={newFunction.arguments}
                  onChange={(e) => setNewFunction({...newFunction, arguments: e.target.value})}
                  placeholder="e.g., price, quantity, tax"
                />
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddFunction} className="flex-1">
                  Add Function
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
