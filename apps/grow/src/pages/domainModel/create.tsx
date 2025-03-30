import {Edge, Node} from '../../lib/type-utils';
import { addEdge, applyNodeChanges, Background, Controls, ReactFlow, ReactFlowInstance, useReactFlow } from '@xyflow/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/context';

function InstanceSetter({ setInstance }: { setInstance: (instance: ReactFlowInstance) => void }) {
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
  const [edges, setEdges] = useState< Edge[]>([]);
  const [graphName, setGraphName] = useState('');
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const {user, loading} = useAuth();

  if(!loading && !user){
    router.push('/domainModel')
  }


  const handlePaneContextMenu = (event: React.MouseEvent|MouseEvent) => {
    event.preventDefault();
    if (!reactFlowInstance) {
      return;
    }
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;

    const canvasCoords = reactFlowInstance.screenToFlowPosition({ x: relativeX, y: relativeY });



    const label = prompt('Enter node label:');
    const tag = prompt('enter current node tag : ');
    if (!label || label.trim() === '') return;
    const newNode = {
      id: Math.random().toString(),
      data: { label, tag},
      position: canvasCoords,
    };
    setNodes((nds : any) => [...nds, newNode]);
    return;
  };

  const onConnect = (params : any) =>
    setEdges((eds : any) => addEdge(params, eds));

  const onEdgeClick = (event: any, edge: any) => {
    const newLabel = prompt('Enter edge label:', edge.label || '');
    if (newLabel !== null) {
      setEdges((eds : any) =>
        eds.map((e : any) => (e.id === edge.id ? { ...e, label: newLabel } : e))
      );
    }
  };

  const deleteNode = (event: React.MouseEvent, node : any) => {
    event.preventDefault();
    if (window.confirm(`Are you sure you want to delete node "${node?.data?.label}"?`)) {
      setNodes((nds : Node[]) => nds.filter((n  : any) => n.id !== node?.id));
      setEdges((eds : Edge[]) =>
        eds.filter((edge : Edge) => edge.source !== node.id && edge.target !== node?.id)
      );
    }
  };
  const deleteEdge = (event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this edge?')) {
      setEdges((eds : any) => eds.filter((e : any) => e.id !== edge?.id));
    }
  };

  const onNodesChange = (changes : any) => {
    setNodes((nds : any) => applyNodeChanges(changes, nds));
  };

  const handleSave = async  ()=>{
    try{
      const nodeIds = nodes.map((node : any) => node?.id);
      const edgeIds = edges.map((edge : any) => edge?.id);
      
      await axios.post('/api/domainModel/createDomainModel', { name : graphName, description : "", nodeIds, edgeIds, nodes, edges });
      alert('Graph created successfully');
      router.push('/domainModel');
    }catch(e){
      alert('Error creating graph');
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter Graph Name"
            value={graphName}
            onChange={(e) => setGraphName(e.target.value)}
            style={{
              padding: '0.5rem',
              marginRight: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flex: '1',
            }}
          />
          <button
            onClick={() => handleSave()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'purple',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onConnect={onConnect}
                  onEdgeClick={onEdgeClick}
                  onEdgeContextMenu={deleteEdge}
                  onNodesChange={onNodesChange}
                  onNodeContextMenu={deleteNode}
                  onPaneContextMenu={handlePaneContextMenu}
                  fitView
        >
          <Controls/>
          <Background/>
          <InstanceSetter setInstance={setReactFlowInstance}/>
        </ReactFlow>
      </div>
    </div>
  );
}
