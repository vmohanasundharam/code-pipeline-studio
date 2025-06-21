
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Settings, Trash2, Save, Play } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/utils/storage";

interface PipelineStep {
  id: number;
  functionName: string;
  argumentMappings: Record<string, string>;
  returnMapping: string;
}

interface MockFunction {
  name: string;
  description: string;
  arguments: { name: string; type: string; dataType: string; }[];
  returnEnabled: boolean;
  returnType?: string;
}

interface MockVariable {
  name: string;
  type: string;
}

const CreatePipeline = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineDescription, setPipelineDescription] = useState('');
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load JS functions from storage
  const [mockFunctions, setMockFunctions] = useState<MockFunction[]>([]);

  useEffect(() => {
    const jsFunctions = storage.getJSFunctions();
    setMockFunctions(jsFunctions);
  }, []);

  // Load pipeline for editing
  useEffect(() => {
    if (editId) {
      const pipelines = storage.getPipelines();
      const pipelineToEdit = pipelines.find(p => p.id === parseInt(editId));
      if (pipelineToEdit) {
        setPipelineName(pipelineToEdit.name);
        setPipelineDescription(pipelineToEdit.description);
        setSteps(pipelineToEdit.steps || []);
        setIsEditing(true);
      }
    }
  }, [editId]);

  const mockVariables: MockVariable[] = [
    { name: 'currentShift', type: 'String' },
    { name: 'machineId', type: 'String' },
    { name: 'qualityThreshold', type: 'Number' },
    { name: 'conversionFactor', type: 'Number' }
  ];

  const [currentStep, setCurrentStep] = useState<Omit<PipelineStep, 'id'>>({
    functionName: '',
    argumentMappings: {},
    returnMapping: ''
  });

  const handleAddStep = () => {
    if (currentStep.functionName) {
      setSteps([...steps, { ...currentStep, id: Date.now() }]);
      setCurrentStep({
        functionName: '',
        argumentMappings: {},
        returnMapping: ''
      });
      setIsStepDialogOpen(false);
    }
  };

  const handleDeleteStep = (stepId: number) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const handleSave = () => {
    if (!pipelineName.trim()) {
      toast({
        title: "Error",
        description: "Pipeline name is required",
        variant: "destructive"
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Error", 
        description: "At least one step is required",
        variant: "destructive"
      });
      return;
    }

    const pipelines = storage.getPipelines();
    const pipelineData = {
      id: isEditing ? parseInt(editId!) : Date.now(),
      name: pipelineName,
      description: pipelineDescription,
      steps: steps,
      status: 'active',
      lastRun: new Date().toISOString().split('T')[0]
    };

    if (isEditing) {
      const updatedPipelines = pipelines.map(p => 
        p.id === parseInt(editId!) ? pipelineData : p
      );
      storage.savePipelines(updatedPipelines);
    } else {
      storage.savePipelines([...pipelines, pipelineData]);
    }

    toast({
      title: "Success",
      description: `Pipeline ${isEditing ? 'updated' : 'created'} successfully`
    });

    navigate('/');
  };

  const handleTest = () => {
    if (!pipelineName.trim() || steps.length === 0) {
      toast({
        title: "Error",
        description: "Please save the pipeline first",
        variant: "destructive"
      });
      return;
    }

    console.log('Testing pipeline:', {
      name: pipelineName,
      description: pipelineDescription,
      steps: steps
    });

    toast({
      title: "Test Started",
      description: "Pipeline test execution started"
    });
  };

  const selectedFunction = mockFunctions.find(f => f.name === currentStep.functionName);

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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Pipeline' : 'Create Pipeline'}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button 
                onClick={handleTest}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Test</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Pipeline Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pipelineName">Pipeline Name</Label>
              <Input
                id="pipelineName"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                placeholder="Enter pipeline name"
              />
            </div>
            <div>
              <Label htmlFor="pipelineDescription">Description</Label>
              <Textarea
                id="pipelineDescription"
                value={pipelineDescription}
                onChange={(e) => setPipelineDescription(e.target.value)}
                placeholder="Describe what this pipeline does"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pipeline Steps</CardTitle>
              <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Step</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {steps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No steps configured yet. Add your first step to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const stepFunction = mockFunctions.find(f => f.name === step.functionName);
                  return (
                    <div key={step.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Step {index + 1}: {step.functionName}
                          </h4>
                          {stepFunction?.description && (
                            <p className="text-sm text-gray-600 mt-1">{stepFunction.description}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteStep(step.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Arguments:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(step.argumentMappings).map(([arg, variable]) => (
                              <div key={arg} className="text-gray-600">
                                {arg} → {variable}
                              </div>
                            ))}
                          </div>
                        </div>
                        {step.returnMapping && (
                          <div>
                            <span className="font-medium text-gray-700">Return:</span>
                            <div className="mt-1 text-gray-600">{step.returnMapping}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Step Dialog */}
        <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Pipeline Step</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="function">Select Function</Label>
                <Select 
                  value={currentStep.functionName} 
                  onValueChange={(value) => setCurrentStep({...currentStep, functionName: value, argumentMappings: {}})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a function" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mockFunctions.map((func) => (
                      <SelectItem key={func.name} value={func.name}>
                        <div>
                          <div className="font-medium">{func.name}</div>
                          <div className="text-sm text-gray-500">{func.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFunction && selectedFunction.arguments.length > 0 && (
                <div>
                  <Label>Map Arguments to Variables</Label>
                  <div className="space-y-3 mt-2">
                    {selectedFunction.arguments.map((arg) => (
                      <div key={arg.name} className="flex items-center space-x-3">
                        <span className="w-32 text-sm font-medium text-gray-700">
                          {arg.name} ({arg.dataType || arg.type}):
                        </span>
                        <Select 
                          value={currentStep.argumentMappings[arg.name] || ''} 
                          onValueChange={(value) => 
                            setCurrentStep({
                              ...currentStep, 
                              argumentMappings: {...currentStep.argumentMappings, [arg.name]: value}
                            })
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select variable" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {mockVariables.filter(v => v.type === (arg.dataType || arg.type)).map((variable) => (
                              <SelectItem key={variable.name} value={variable.name}>
                                {variable.name} ({variable.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFunction && selectedFunction.returnEnabled && (
                <div>
                  <Label htmlFor="returnMapping">Map Return to Variable</Label>
                  <Select 
                    value={currentStep.returnMapping} 
                    onValueChange={(value) => setCurrentStep({...currentStep, returnMapping: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variable for return value" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {mockVariables.filter(v => v.type === selectedFunction.returnType).map((variable) => (
                        <SelectItem key={variable.name} value={variable.name}>
                          {variable.name} ({variable.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsStepDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddStep} className="flex-1">
                  Add Step
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreatePipeline;
