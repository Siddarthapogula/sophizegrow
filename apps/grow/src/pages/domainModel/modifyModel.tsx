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
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {Edge, Node, Resource} from '../../lib/type-utils';
import { useAuth } from '../../components/context';
import SuccessiveNodes from '../../components/SuccessiveNodes';
import NormalNodes from '../../components/normalNodes';
import RightSideBar from '../../components/RightSideBar';
import ResourceModal from '../../components/ResourcesModal';
import {
  addEdgeToGraph,
  addLabelToEdge,
  addNodeToGraph,
  addResourceToNode,
  deleteEdgeWithId,
  deleteNodeFromGraph,
  deleteResourceOfNode,
  getDomainModel,
  getResourcesOfNode,
  updateResourceOfNode,
} from '../../utils/apis';
import NodesSkeleton from '../../components/NodesSkeleton';
import { loadingEdges, loadingNodes } from '../../utils/constants';
import NewlyAddedNodeLoading from '../../components/NewlyAddedNodeLoading';
import { useToast } from '@grow/shared';

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

export default function ModifyDomainModel() {
  const { user, loading } = useAuth();
  const { toast, toasts } = useToast();
  const nodeTypes = {
    successive: SuccessiveNodes,
    normal: NormalNodes,
    loading: NodesSkeleton,
    newlyAdded: NewlyAddedNodeLoading,
  };

  const router = useRouter();
  const [nodes, setNodes] = useState<any[]>(loadingNodes);
  const [edges, setEdges] = useState<any[]>(loadingEdges);

  const [isloading, setIsLoading] = useState(true);

  const [selectedNode, setSelectedNode] = useState<any>();
  const [selectedNodeResources, setSelectedNodeResources] = useState<
    Resource[]
  >([]);

  const debouncerTimeout = useRef<NodeJS.Timeout | null>(null);
  const [genAiNodes, setGenAiNodes] = useState<any>([]);
  const genAiNodesRef = useRef<any>(genAiNodes);
  const [genAiEdges, setGenAiEdges] = useState<any>([]);
  const genAiEdgesRef = useRef<any>(genAiEdges);

  const [modalState, setModalState] = useState<{
    isModalOpen: boolean;
    isEditMode: boolean;
    isAddingResource: boolean;
    isUpdating: boolean;
    updatingResource: Resource | null;
  }>({
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

  if (!user && !loading) {
    router.push('/domainModel');
  }

  useEffect(() => {
    async function getGraphData() {
      setIsLoading(true);
      try {
        const data = await getDomainModel();
        const wrappedNodes = data.nodes.map((nd: any) => {
          return {
            id: nd.id,
            type: 'normal',
            data: {
              label: nd.data.label,
              name: nd.data.label,
              description: nd.description,
              position: {
                x: nd.position.x,
                y: nd.position.y,
              },
              nodeId: nd.id,
              handleAddSuccessiveNodeClick: (data: any) =>
                handleAddSuccessiveNodeClick(data),
            },
            position: {
              x: nd.position.x,
              y: nd.position.y,
            },
          };
        });
        setNodes(wrappedNodes);
        setEdges(data.edges);
      } catch (e) {
        toast({
          title: 'Error getting graph data',
          description: 'Please reload again later',
          // variant: 'destructive',
          duration: 2000,
        });
      }
      setIsLoading(false);
    }
    getGraphData();
  }, []);

  useEffect(() => {
    async function getNodeResourceDetails() {
      try {
        setSelectedNodeResources(await getResourcesOfNode(selectedNode?.id));
      } catch (e) {
        toast({
          title: 'Error getting node resources',
          description: 'Please reload again later',
          variant: 'destructive',
          duration: 3000,
        });
      }
    }
    if (selectedNode) {
      getNodeResourceDetails();
    }
  }, [selectedNode]);

  // resource modal

  async function handleAddResource() {
    if (!resourceFormDetails.title || !resourceFormDetails.url) {
      toast({
        title: 'Please enter title and url',
        description: 'try again with title and url',
        variant: 'destructive',
        duration: 2000,
      });
      return;
    }
    const resource = {
      nodeId: selectedNode?.id,
      title: resourceFormDetails.title,
      description: resourceFormDetails.description,
      url: resourceFormDetails.url,
    };
    const data = await addResourceToNode(resource);
    setSelectedNodeResources([...selectedNodeResources, data.resource]);
    setResourceFormDetails({ title: '', description: '', url: '' });
    setModalState({ ...modalState, isAddingResource: false });
  }

  async function deleteResource(resourceId: string) {
    await deleteResourceOfNode(resourceId);
    setSelectedNodeResources(
      selectedNodeResources.filter((res) => res.id !== resourceId)
    );
  }

  async function handleUpdateResource() {
    if (!resourceFormDetails.title || !resourceFormDetails.url) {
      toast({
        title: 'Please enter title and url for updating',
        description: 'try again after entering title and url',
        variant: 'destructive',
        duration: 2000,
      });
      return;
    }
    const resource = {
      id: modalState?.updatingResource?.id,
      title: resourceFormDetails.title,
      description: resourceFormDetails.description,
      url: resourceFormDetails.url,
    };
    await updateResourceOfNode(resource);
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

  // model modification functions

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
    const description = prompt('enter current node description : ');
    if (!label || label.trim() === '' || !tag) return;
    const newNode = {
      id: crypto.randomUUID(),
      data: { label, tag, description: description},
      position: canvasCoords,
    };
    try {
      await addNodeToGraph(newNode);
      const addedNode = {
        id: newNode.id,
        type: 'normal',
        data: {
          label: newNode.data.label,
          name: newNode.data.label,
          description: description,
          tag: tag,
          position: {
            x: newNode.position.x,
            y: newNode.position.y,
          },
          nodeId: newNode.id,
          handleAddSuccessiveNodeClick: (data: any) =>
            handleAddSuccessiveNodeClick(data),
        },
        position: {
          x: newNode.position.x,
          y: newNode.position.y,
        },
      };
      setNodes((nds: any) => [...nds, addedNode]);
    } catch (e) {
      toast({
        title: 'Error Adding Node',
        description: 'try again please',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const onEdgeClick = async (event: any, edge: any) => {
    try {
      const newLabel = prompt('Enter edge label:', edge.label || '');
      if (newLabel !== null) {
        await addLabelToEdge({
          id: `${edge.source}-${edge.target}`,
          label: newLabel,
        });
        setEdges((eds: any) =>
          eds.map((e: any) =>
            e.id === edge.id ? { ...e, label: newLabel } : e
          )
        );
      }
    } catch (e) {
      toast({
        title: 'Error Updating Edge',
        description: 'try again',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const deleteNode = async (event: React.MouseEvent, node: any) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete node "${node.data?.label}"?`
      )
    ) {
      try {
        const edgeId = (edges as any).find(
          (edge: any) => edge.source === node.id || edge.target === node.id
        )?.id;
        await deleteNodeFromGraph(edgeId, node.id);
        setNodes((nds: any) => nds.filter((n: any) => n.id !== node.id));
        setEdges((eds: any) =>
          eds.filter(
            (edge: any) => edge.source !== node.id && edge.target !== node.id
          )
        );
      } catch (e) {
        toast({
          title: 'Error Deleting Node ',
          description: 'please try again ',
          variant: 'destructive',
          duration: 2000,
        });
      }
    }
  };

  const deleteEdge = async (event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this edge?')) {
      try {
        const edgeId = edge.id;
        await deleteEdgeWithId(edgeId);
        setEdges((eds: any) => eds.filter((e: any) => e.id !== edge.id));
      } catch (e) {
        toast({
          title: 'Error Deleting Edge',
          description: 'please try again ',
          variant: 'destructive',
          duration: 2000,
        });
      }
    }
  };

  // react-flow utils, for graph modification

  const onNodesChange = (changes: any) => {
    setNodes((nds: any) => applyNodeChanges(changes, nds));
  };

  const onConnect = async (params: any) => {
    try {
      await addEdgeToGraph(params);
    } catch (e) {
      toast({
        title: 'Error Adding Edge',
        description: 'please try again ',
        variant: 'destructive',
        duration: 2000,
      });
    }
    setEdges((eds: any) => addEdge(params, eds));
  };

  // gen-ai-nodes generation functions

  const [genAiResources, setGenAiResources] = useState<any>();
  // const [cachedNodeIds, setCachedNodeIds] = useState<any>();

  async function handleNodeHover(event: React.MouseEvent, node: any) {
    if (node.type === 'loading') return;
    if (debouncerTimeout.current) clearTimeout(debouncerTimeout.current);
    if (genAiNodesRef.current.find((nd: any) => nd.id === node.id)) return;
    debouncerTimeout.current = setTimeout(async () => {
      const context = {
        name: node.data.label,
        description: node.data.description,
        tag: node.data.tag,
        resources: [],
      };
      const { data } = await axios.post('/api/domainModel/gen-ai/get-suggestion-nodes', { context });
      let nodeSpacingX = 300;
      let nodeSpacingY = 150;
      const newNodes = data.map((nd: any, index: any) => {
        return {
          id: nd.id,
          type: 'successive',
          data: {
            label: nd.name,
            description: nd.description,
            tag: nd?.name,
            name: nd.name,
            position: {
              x:
                node.position.x +
                (index - Math.floor(data.length / 2)) * nodeSpacingX,
              y: node.position.y + nodeSpacingY,
            },
            resources: nd?.resources,
            nodeId: nd.id,
            handleAddSuccessiveNodeClick: (data: any) =>
              handleAddSuccessiveNodeClick(data),
          },
          position: {
            x:
              node.position.x +
              (index - Math.floor(data.length / 2)) * nodeSpacingX,
            y: node.position.y + nodeSpacingY,
          },
        };
      });

      const newEdges = data.map((nd: any) => {
        return {  
          id: `${node.id}-${nd.id}`,
          source: node.id,
          target: nd.id,
        };
      });
      setGenAiNodes(newNodes);
      setGenAiEdges(newEdges);
      genAiNodesRef.current = newNodes;
      genAiEdgesRef.current = newEdges;
    }, 1000);
  }


  async function handleAddSuccessiveNodeClick(data: any) {
    const curNode = genAiNodesRef.current.find(
      (nd: any) => nd.id === data.nodeId
    );
    console.log(curNode);
    const curEdge = genAiEdgesRef.current.find(
      (ed: any) => ed.target === data.nodeId
    );

    let updatedNodesForGenAiSuggestions = genAiNodesRef.current.map(
      (nd: any) => {
        if (nd.id == data.nodeId) {
          return {
            ...nd,
            data: {
              ...nd.data,
              label: 'adding the suggested node',
            },
            type: 'newlyAdded',
          };
        }
        return nd;
      }
    );

    setGenAiNodes(updatedNodesForGenAiSuggestions);
    genAiNodesRef.current = updatedNodesForGenAiSuggestions;

    const newNode = {
      id: data?.nodeId,
      label: data?.name,
      type: 'normal',
      description: data?.description,
      tag: 'gen-ai-nodes',
      data: {
        label: data?.name,
        description: data?.description,
        name: data?.name,
        nodeId: data?.nodeId,
        handleAddSuccessiveNodeClick: (data: any) =>
          handleAddSuccessiveNodeClick(data),
        position: data?.position,
        resources: data?.resources,
      },
      position: data?.position,
    };
    try {
      await addNodeToGraph(curNode);
      await addEdgeToGraph(curEdge);
    } catch (e) {
      toast({
        title: 'Error adding suggestion Node',
        description: 'please try again ',
        variant: 'destructive',
        duration: 2000,
      });
      return;
    }

    updatedNodesForGenAiSuggestions = genAiNodesRef.current.filter(
      (nd: any) => nd.id !== data.nodeId
    );
    const updatedEdgesForGenAiSuggestions = genAiEdgesRef.current.filter(
      (edge: any) => edge.target !== data.nodeId
    );
    setGenAiNodes(updatedNodesForGenAiSuggestions);
    setGenAiEdges(updatedEdgesForGenAiSuggestions);
    genAiEdgesRef.current = updatedEdgesForGenAiSuggestions;
    genAiNodesRef.current = updatedNodesForGenAiSuggestions;

    setNodes((nds: any) => [...nds, newNode]);
    setEdges((eds: any) => [...eds, curEdge]);
  }


  // node resources function
  function handleNodeClick(event: React.MouseEvent, node: any) {
    if (genAiNodesRef.current.find((nd: any) => nd.id == node.id)) return;
    setSelectedNode(node);
    setModalState({ ...modalState, isModalOpen: true });
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex h-screen  bg-gray-100 border-b border-gray-200">
        <div className="w-[77%] p-4 bg-gray-100">
          <ReactFlow
            nodes={[...nodes, ...genAiNodesRef.current]}
            edges={[...edges, ...genAiEdgesRef.current]}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgeClick={onEdgeClick}
            onNodeClick={handleNodeClick}
            onEdgeContextMenu={deleteEdge}
            onNodeContextMenu={deleteNode}
            onPaneContextMenu={handlePaneContextMenu}
            onNodeMouseEnter={handleNodeHover}
            onNodeMouseLeave={() =>
              debouncerTimeout.current && clearTimeout(debouncerTimeout.current)
            }
            onPaneClick={() => {
              setGenAiEdges([]);
              setGenAiNodes([]);
              genAiEdgesRef.current = [];
              genAiNodesRef.current = [];
            }}
            // fitView
          >
            <Controls />
            <Background />
            <InstanceSetter setInstance={setReactFlowInstance} />
          </ReactFlow>
        </div>
        <RightSideBar />
        <ResourceModal
          modalState={modalState}
          resourceFormDetails={resourceFormDetails}
          selectedNode={selectedNode}
          selectedNodeResources={selectedNodeResources}
          setResourceFormDetails={setResourceFormDetails}
          setSelectedNodeResources={setSelectedNodeResources}
          setModalState={setModalState}
          deleteResource={deleteResource}
          handleAddResource={handleAddResource}
          handleUpdateResource={handleUpdateResource}
          canModify= {true}
        />
      </div>
    </div>
  );
}
