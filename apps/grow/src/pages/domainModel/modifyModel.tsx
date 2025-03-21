import {
  addEdge,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@grow/shared';
import { useRouter } from 'next/navigation';
import { Edge, Node, Resource } from '@lib/type-utils';

function InstanceSetter({
  setInstance,
}: {
  setInstance: (instance: ReactFlowInstance) => void;
}) {
  const instance = useReactFlow();
  useEffect(() => {
    if (instance) {
      setInstance(instance);
    }
  }, [instance, setInstance]);
  return null;
}

export default function CreateDomainModel() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [isloading, setIsLoading] = useState(true);

  const [selectedNode, setSelectedNode] = useState<Node>();
  const [selectedNodeResources, setSelectedNodeResources] = useState<Resource[]>([]);

  const [modalState, setModalState] = useState<{
    isModalOpen: boolean,
    isEditMode: boolean,
    isAddingResource: boolean,
    isUpdating: boolean,
    updatingResource: Resource | null}>({
    isModalOpen: false,
    isEditMode: false,
    isAddingResource: false,
    isUpdating: false,
    updatingResource: null,
  });

  const [resourceFormDetails, setResourceFormDetails] = useState({
    title: '',
    description: '',
    url: '',
  });

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    async function getGraphData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/domainModel/getDomainModel');
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (e) {
        alert('Error getting graph data');
      }
      setIsLoading(false);
    }
    getGraphData();
  }, []);

  useEffect(() => {
    async function getNodeResourceDetails() {
      try {
        const { data } = await axios.get(
          `/api/domainModel/node/getResources?nodeId=${
            selectedNode?.id
          }`
        );
        setSelectedNodeResources(data);
      } catch (e) {
        alert('Error getting node details');
      }
    }
    if (selectedNode) {
      getNodeResourceDetails();
    }
  }, [selectedNode]);

  async function handleAddResource() {
    if (!resourceFormDetails.title || !resourceFormDetails.url) {
      alert('Please enter title and url');
      return;
    }
    const resource = {
      nodeId: (selectedNode)?.id,
      title: resourceFormDetails.title,
      description: resourceFormDetails.description,
      url: resourceFormDetails.url,
    };
    const { data } = await axios.post(
      '/api/domainModel/node/addResource',
      resource
    );
    setSelectedNodeResources([
      ...selectedNodeResources,
      data.resource,
    ]);
    setResourceFormDetails({ title: '', description: '', url: '' });
    setModalState({ ...modalState, isAddingResource: false });
  }

  async function deleteResource(resourceId: string) {
    await axios.post('/api/domainModel/node/deleteResource', { resourceId });
    setSelectedNodeResources(
      selectedNodeResources.filter((res) => res.id !== resourceId)
    );
  }

  async function handleUpdateResource() {
    if (!resourceFormDetails.title || !resourceFormDetails.url) {
      alert('Please enter title and url for updating');
      return;
    }
    const resource = {
      id: modalState?.updatingResource?.id,
      title: resourceFormDetails.title,
      description: resourceFormDetails.description,
      url: resourceFormDetails.url,
    };
    await axios.post('/api/domainModel/node/updateResource', resource);
    const updatedResources = selectedNodeResources.map((res: Resource) => {
      if (res.id === resource.id) {
        return resource;
      }
      return res;
    });
    setSelectedNodeResources(updatedResources as Resource[]);
    setModalState({
      ...modalState,
      isUpdating: false,
      updatingResource: null,
    });
    setResourceFormDetails({ title: '', description: '', url: '' });
  }

  const handlePaneContextMenu = async (
    event: React.MouseEvent | MouseEvent
  ) => {
    event.preventDefault();
    if (!reactFlowInstance) {
      return;
    }
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;
    const canvasCoords = reactFlowInstance.screenToFlowPosition({
      x: relativeX,
      y: relativeY,
    });
    const label = prompt('Enter node label:');
    const tag = prompt('enter current node tag : ');
    if (!label || label.trim() === '' || !tag) return;
    const newNode = {
      id: Math.random().toString(),
      data: { label, tag },
      position: canvasCoords,
    };
    try {
      await axios.post('/api/domainModel/update/addNode', newNode);
      setNodes((nds: Node[]) => [...nds, newNode]);
    } catch (e) {
      alert('Error adding node');
    }
  };

  const onConnect = async (params: any) => {
    setEdges((eds: Edge[]) => addEdge(params, eds));
    try {
      await axios.post('/api/domainModel/update/addEdge', params);
    } catch (e) {
      alert('Error adding edge');
    }
  };

  const onEdgeClick = async (event: any, edge: Edge) => {
    try {
      const newLabel = prompt('Enter edge label:', edge.label || '');
      if (newLabel !== null) {
        axios.post('/api/domainModel/update/updateEdgeLabel', {
          id: `${edge.source}-${edge.target}`,
          label: newLabel,
        });
        setEdges((eds: Edge[]) =>
          eds.map((e: Edge) =>
            e.id === edge.id ? { ...e, label: newLabel } : e
          )
        );
      }
    } catch (e) {
      alert('Error updating edge');
    }
  };

  const deleteNode = async (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete node "${node.data?.label}"?`
      )
    ) {
      try {
        const edgeId = (edges as Edge[]).find(
          (edge: Edge) => edge.source === node.id || edge.target === node.id
        )?.id;
        await axios.post('/api/domainModel/update/deletenode', {
          edgeId,
          nodeId: node.id,
        });
        setNodes((nds: Node[]) => nds.filter((n: Node) => n.id !== node.id));
        setEdges((eds: Edge[]) =>
          eds.filter(
            (edge: Edge) => edge.source !== node.id && edge.target !== node.id
          )
        );
      } catch (e) {
        alert('Error deleting node');
      }
    }
  };
  const deleteEdge = (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this edge?')) {
      try {
        const edgeId = edge.id;
        axios.post('/api/domainModel/update/deleteEdge', { edgeId });
        setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.id !== edge.id));
      } catch (e) {
        alert('Error deleting edge');
      }
    }
  };

  const onNodesChange = (changes: any) => {
    setNodes((nds : Node[]) => applyNodeChanges(changes, nds));
  };

  function closeModal() {
    setModalState({
      ...modalState,
      isModalOpen: false,
      isUpdating: false,
      updatingResource: null,
      isEditMode: false,
      isAddingResource: false,
    });
    setResourceFormDetails({ title: '', description: '', url: '' });
  }

  function handleNodeClick(event: React.MouseEvent, node: Node) {
    setSelectedNode(node);
    setModalState({ ...modalState, isModalOpen: true });
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex  gap-5 items-center p-4 bg-gray-200 border-b border-gray-300">
        <h1>{'Modify Domain Model'}</h1>
        <Button onClick={() => router.push('/domainModel')}>Back</Button>
      </div>
      <div className="flex h-screen  bg-gray-100 border-b border-gray-200">
        <div className="w-3/4 p-4 bg-gray-100">
          {isloading && (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onEdgeContextMenu={deleteEdge}
            onNodesChange={onNodesChange}
            onNodeContextMenu={deleteNode}
            onPaneContextMenu={handlePaneContextMenu}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Controls />
            <Background />
            <InstanceSetter setInstance={setReactFlowInstance} />
          </ReactFlow>
        </div>
        <div className="w-1/4 p-4 bg-gray-200">
          <ul>
            Help
            <li>Right click on canvas to add a node</li>
            <li>Right click on node to delete it</li>
            <li>Right click on edge to delete it</li>
            <li>Click on edge to edit its label</li>
          </ul>
        </div>
        <Dialog open={modalState.isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[400px] p-4 space-y-4 bg-white rounded-lg shadow-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-indigo-600">
                {selectedNode?.data?.label} Details
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Description of the node.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-md font-semibold text-gray-700">
                  Resources:
                </h1>
                <Button
                  onClick={() => {
                    setModalState({
                      ...modalState,
                      isEditMode: !modalState.isEditMode,
                      isAddingResource: false,
                      isUpdating: false,
                    });
                  }}
                  className="bg-indigo-500 text-white px-3 py-1 text-sm"
                >
                  {modalState.isEditMode ? 'Done' : 'Edit'}
                </Button>
              </div>

              {modalState.isEditMode && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setModalState({
                        ...modalState,
                        isAddingResource: true,
                        isUpdating: false,
                      });
                      setResourceFormDetails({
                        title: '',
                        description: '',
                        url: '',
                      });
                    }}
                    className="bg-green-500 text-white px-3 py-1 text-sm"
                  >
                    Add
                  </Button>
                </div>
              )}
              {selectedNodeResources.length === 0 ? (
                <p className="text-gray-400 italic">No resources found</p>
              ) : (
                selectedNodeResources.map((resource: Resource, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="font-medium text-md text-blue-600">
                        {resource.title}
                      </h1>
                    </a>
                    <p className="text-gray-600 text-xs mb-1">
                      {resource?.description}
                    </p>
                    {modalState.isEditMode && (
                      <div className="flex space-x-1 mt-1">
                        <Button
                          className="bg-yellow-500 text-white px-2 py-1 text-xs"
                          onClick={() => {
                            setResourceFormDetails({
                              title: resource.title,
                              description: resource.description,
                              url: resource.url,
                            });
                            setModalState({
                              ...modalState,
                              isUpdating: true,
                              isAddingResource: false,
                              updatingResource: resource,
                            });
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => deleteResource(resource.id)}
                          className="bg-red-500 text-white px-2 py-1 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {(modalState.isAddingResource || modalState.isUpdating) && (
              <div className="space-y-2 border-t pt-2">
                <label className="block text-gray-700 font-medium text-sm">
                  Title
                </label>
                <input
                  type="text"
                  value={resourceFormDetails.title}
                  onChange={(e) =>
                    setResourceFormDetails({
                      ...resourceFormDetails,
                      title: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
                />
                <label className="block text-gray-700 font-medium text-sm">
                  Description
                </label>
                <input
                  type="text"
                  value={resourceFormDetails.description}
                  onChange={(e) =>
                    setResourceFormDetails({
                      ...resourceFormDetails,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
                />
                <label className="block text-gray-700 font-medium text-sm">
                  URL
                </label>
                <input
                  type="text"
                  value={resourceFormDetails.url}
                  onChange={(e) =>
                    setResourceFormDetails({
                      ...resourceFormDetails,
                      url: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
                />
                {
                  <Button
                    onClick={() => {
                      if (modalState.isAddingResource) {
                        handleAddResource();
                      } else {
                        handleUpdateResource();
                      }
                    }}
                    className="bg-blue-500 text-white w-full mt-1 text-sm"
                  >
                    {modalState.isAddingResource ? 'Add' : 'Update'}
                  </Button>
                }
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
