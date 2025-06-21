
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Code, Zap, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/utils/storage";

const Index = () => {
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState<any[]>([]);

  useEffect(() => {
    const storedPipelines = storage.getPipelines();
    setPipelines(storedPipelines);
  }, []);

  const handleEditPipeline = (pipelineId: number) => {
    navigate(`/create-pipeline?edit=${pipelineId}`);
  };

  const handleRunPipeline = (pipelineId: number) => {
    console.log('Running pipeline:', pipelineId);
    // Add run pipeline logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline Builder</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/global-variables')}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Global Variables</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/js-modules')}
                className="flex items-center space-x-2"
              >
                <Code className="h-4 w-4" />
                <span>JS Modules</span>
              </Button>
              <Button 
                onClick={() => navigate('/create-pipeline')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Pipeline</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Pipelines</h2>
          <p className="text-gray-600">Manage and monitor your automated workflows</p>
        </div>

        {pipelines.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Zap className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No pipelines yet</h3>
                <p className="text-gray-500 max-w-md">
                  Get started by creating your first pipeline to automate your workflows
                </p>
                <Button onClick={() => navigate('/create-pipeline')}>
                  Create Your First Pipeline
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelines.map((pipeline) => (
              <Card 
                key={pipeline.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEditPipeline(pipeline.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pipeline.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pipeline.status || 'inactive'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{pipeline.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Steps:</span>
                      <span className="font-medium">{pipeline.steps?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span className="font-medium">{pipeline.lastRun || 'Never'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPipeline(pipeline.id);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunPipeline(pipeline.id);
                      }}
                    >
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
