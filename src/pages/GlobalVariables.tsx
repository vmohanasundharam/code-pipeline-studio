
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Edit, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GlobalVariables = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVariable, setNewVariable] = useState({
    name: '',
    value: '',
    type: 'String',
    description: ''
  });

  const systemVariables = [
    { name: 'currentShift', value: 'SHIFT_A', type: 'String', description: 'Current production shift' },
    { name: 'machineId', value: 'LINE_01_MACHINE_03', type: 'String', description: 'Unique machine identifier' },
    { name: 'timestamp', value: 'auto-generated', type: 'Number', description: 'Current system timestamp' }
  ];

  const [userVariables, setUserVariables] = useState([
    { name: 'qualityThreshold', value: '95.5', type: 'Number', description: 'Quality threshold percentage' },
    { name: 'conversionFactor', value: '1.2', type: 'Number', description: 'Data conversion multiplier' }
  ]);

  const handleAddVariable = () => {
    if (newVariable.name && newVariable.value) {
      setUserVariables([...userVariables, { ...newVariable }]);
      setNewVariable({ name: '', value: '', type: 'String', description: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteVariable = (index: number) => {
    setUserVariables(userVariables.filter((_, i) => i !== index));
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
              <h1 className="text-2xl font-bold text-gray-900">Global Variables Configuration</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* System Variables */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <CardTitle>System-Defined Variables</CardTitle>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Read-Only</span>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemVariables.map((variable, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{variable.name}</TableCell>
                    <TableCell className="text-gray-600">{variable.value}</TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {variable.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{variable.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Variables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User-Defined Variables</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Variable</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Variable</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                        placeholder="Variable name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        value={newVariable.value}
                        onChange={(e) => setNewVariable({...newVariable, value: e.target.value})}
                        placeholder="Variable value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newVariable.type} onValueChange={(value) => setNewVariable({...newVariable, type: value})}>
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
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newVariable.description}
                        onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                        placeholder="Variable description"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddVariable} className="flex-1">
                        Add Variable
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userVariables.map((variable, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{variable.name}</TableCell>
                    <TableCell className="text-gray-600">{variable.value}</TableCell>
                    <TableCell>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {variable.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{variable.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteVariable(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalVariables;
