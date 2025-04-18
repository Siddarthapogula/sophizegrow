import React, { useEffect, useState } from 'react';
import { applyNodeChanges, Background, ReactFlow } from '@xyflow/react';
import NormalNodes from './normalNodes';
import NodesSkeleton from './NodesSkeleton';
import CertifiedNode from './certifiedNodes';
import { Certificate, Edge, Node, Resource } from '../lib/type-utils';
import ResourceModal from './ResourcesModal';
import { getResourcesOfNode } from '../utils/apis';

const DomainModelViewer = ({
  universalDomainModelData,
  certifications,
}: {
  universalDomainModelData: {
    nodes: Node[];
    edges: Edge[];
  };
  certifications: Certificate[];
}) => {
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedNodeResources, setSelectedNodeResources] = useState<any>([]);
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
  const nodeTypes = {
    normal: NormalNodes,
    loading: NodesSkeleton,
    certified: CertifiedNode,
  };

  useEffect(() => {
    if (universalDomainModelData?.nodes?.length) {
      const formattedNodes = universalDomainModelData.nodes.map((node: any) => {
        const isCertified = certifications?.some(
          (cert: any) => cert.abilityId === node.id
        );

        return {
          ...node,
          type: isCertified ? 'certified' : 'normal',
        };
      });

      setNodes(formattedNodes);
      setEdges(universalDomainModelData.edges || []);
    }
  }, [universalDomainModelData, certifications]);
  useEffect(() => {
    async function getNodeResourceDetails() {
      setSelectedNodeResources(await getResourcesOfNode(selectedNode?.id));
    }
    if (selectedNode) {
      getNodeResourceDetails();
    }
  }, [selectedNode]);
  const onNodesChange = (changes: any) => {
    setNodes((nds : any[]) => applyNodeChanges(changes, nds));
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-row w-full h-full">
        <div className="flex-1 relative">
          {nodes.length ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onNodeClick={(event, node) => {
                setSelectedNode(node);
                setModalState({
                  ...modalState,
                  isModalOpen: true,
                  isEditMode: false,
                  isAddingResource: false,
                  isUpdating: false,
                  updatingResource: null,
                });
              }}
              fitView
            >
              <Background />
            </ReactFlow>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No domain model data available.</p>
            </div>
          )}
        </div>
      </div>
      <ResourceModal
        modalState={modalState}
        resourceFormDetails={null}
        selectedNode={selectedNode}
        selectedNodeResources={selectedNodeResources}
        setResourceFormDetails={null}
        setModalState={setModalState}
        setSelectedNodeResources={setSelectedNodeResources}
        deleteResource={null}
        handleAddResource={null}
        handleUpdateResource={null}
        canModify={false}
      />
    </div>
  );
};

export default DomainModelViewer;
