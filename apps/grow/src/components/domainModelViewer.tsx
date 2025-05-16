import React, { useEffect, useMemo, useState } from 'react';
import { applyNodeChanges, Background, ReactFlow } from '@xyflow/react';
import NormalNodes from './normalNodes';
import NodesSkeleton from './NodesSkeleton';
import CertifiedNode from './certifiedNodes';
import { Certificate, Edge, Node, Resource } from '../lib/type-utils';
import ResourceModal from './ResourcesModal';
import { getResourcesOfNode } from '../utils/apis';
import { getDynamicalLayoutElements } from '../utils/domainModelUtils';

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
  const [filteredNodes, setFilteredNodes] = useState<any>([]);
  const [filteredEdges, setFilteredEdges] = useState<Edge[]>([]);
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
    const getGraphData = async () => {
      if(!universalDomainModelData) {
        setNodes([]);
        setEdges([]);
        setFilteredNodes([]);
        setFilteredEdges([]);
        return;
      }
      try {
        const { nodes: loadingNodes, edges: loadingEdges } =
          getDynamicalLayoutElements([], []);
        setFilteredNodes(loadingNodes);
        setFilteredEdges(loadingEdges);

        const data = universalDomainModelData; // already passed via props

        const dElements = getDynamicalLayoutElements(data.nodes, data.edges);
        const updatedNodes = dElements.nodes.map((nd: any) => {
          const isCertified = certifications?.some(
            (cert: any) => cert.abilityId === nd.id
          );
          return {
            id: nd.id,
            type: isCertified ? 'certified' : 'normal',
            data: {
              label: nd.data.label,
              tag: nd.data.tag,
              nodeId: nd.id,
              description: nd?.description,
              name: nd?.name,
              position: nd.position,
            },
            position: nd.position,
          };
        });

        setNodes(updatedNodes);
        setEdges(dElements.edges);
        setFilteredNodes(updatedNodes);
        setFilteredEdges(dElements.edges);
      } catch (err) {
        console.error('Error fetching graph data:', err);
      }
    };
    getGraphData();
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
    setNodes((nds: any[]) => applyNodeChanges(changes, nds));
  };

  const filterOptions = useMemo(() => {
    return (
      universalDomainModelData?.nodes?.reduce((acc: any, node: any) => {
        const tag = node.data?.tag;
        if (tag) {
          acc[tag] = (acc[tag] || 0) + 1;
        }
        return acc;
      }, {}) || {}
    );
  }, [universalDomainModelData]);

  const handleDropDownFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    if (filter === 'all') {
      setFilteredNodes(nodes);
      setFilteredEdges(edges);
      return;
    }

    const initialNodes = nodes.filter(
      (node: any) =>
        node?.data.tag === filter || node?.data.tag?.includes(filter)
    );

    const selectedNodeIds = new Set(initialNodes.map((node: any) => node.id));

    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      edges.forEach((edge: Edge) => {
        if (
          selectedNodeIds.has(edge.source) &&
          !selectedNodeIds.has(edge.target)
        ) {
          selectedNodeIds.add(edge.target);
          addedNew = true;
        }
      });
    }

    const filteredNodesList = nodes.filter((node: any) =>
      selectedNodeIds.has(node.id)
    );
    const filteredEdgesList = edges.filter(
      (edge: any) =>
        selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    );

    setFilteredNodes(filteredNodesList);
    setFilteredEdges(filteredEdgesList);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-2">
        <select onChange={handleDropDownFilter} className="border p-2 rounded">
          <option value="all">All</option>
          {Object.entries(filterOptions).map(([tag]) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row w-full h-full">
        <div className="flex-1 relative">
          {nodes.length ? (
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
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
