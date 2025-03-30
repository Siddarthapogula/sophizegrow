import { Button } from '@grow/shared';
import React, { useEffect, useMemo, useState } from 'react';
import { Background, ReactFlow } from '@xyflow/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {Edge, Node, Graph} from '../../lib/type-utils';
import { useAuth } from '../../components/context';
import NormalNodes from '../../components/normalNodes';
import { loadingEdges, loadingNodes } from '../../utils/constants';
import NodesSkeleton from '../../components/NodesSkeleton';

export default function DashboardLayout() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  const [filteredNodes, setFilteredNodes] = useState<any[]>([]);
  const [filteredEdges, setFilteredEdges] = useState<any[]>([]);

  const [graphData, setGraphData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const router = useRouter();

  const nodeTypes = {
    normal: NormalNodes,
    loading: NodesSkeleton,
  };

  useEffect(() => {
    const getGraphData = async () => {
      try {
        setFilteredNodes(loadingNodes);
        setFilteredEdges(loadingEdges);
        const { data } = await axios.get(`/api/domainModel/getDomainModel`);
        setGraphData(data);
        setNodes((prev) => {
          return data.nodes.map((nd: any) => {
            return {
              id: nd.id,
              type: 'normal',
              data: {
                label: nd.data.label,
                tag: nd.data.tag,
                nodeId: nd.id,
                description: nd?.description,
                name: nd?.name,
                position: {
                  x: nd.position.x,
                  y: nd.position.y,
                },
              },
              position: {
                x: nd.position.x,
                y: nd.position.y,
              },
            };
          });
        });
        setEdges(data.edges);
        setFilteredNodes((prev) => {
          return data.nodes.map((nd: any) => {
            return {
              id: nd.id,
              type: 'normal',
              data: {
                label: nd.data.label,
                tag: nd.tag,
                nodeId: nd.id,
                description: nd?.description,
                name: nd?.name,
                position: {
                  x: nd.position.x,
                  y: nd.position.y,
                },
              },
              position: {
                x: nd.position.x,
                y: nd.position.y,
              },
            };
          });
        });
        setFilteredEdges(data.edges);
      } catch (err) {
        setError('Error fetching graph data.');
      } finally {
        setLoading(false);
      }
    };
    getGraphData();
  }, []);

  const handleDropDownFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    if (filter === 'all') {
      setFilteredNodes(nodes);
      setFilteredEdges(edges);
      return;
    }

    const initialNodes = nodes.filter(
      (node: any) =>
        node?.data.tag === filter ||
        (node?.data.tag && node?.data.tag.includes(filter))
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

  const filterOptions = useMemo(() => {
    return (
      (graphData as Graph)?.nodes?.reduce((acc: any, node: any) => {
        if ((node as any)?.data.tag) {
          acc[(node as any)?.data.tag] = (acc[node?.data.tag] || 0) + 1;
        }
        return acc;
      }, {}) || {}
    );
  }, [graphData]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-row w-full h-full">
        <div className="flex-1 relative">
          {error ? (
            <div className="flex justify-center items-center h-full">
              <p>{error}</p>
            </div>
          ) : filteredNodes.length ? (
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
            </ReactFlow>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No graph data available for the selected filter.</p>
            </div>
          )}
        </div>
        <div className="w-[23%] p-4 bg-white border-l border-gray-200 shadow-md rounded-lg overflow-y-auto">
          {user && (
            <Button
              onClick={() => router.push('/domainModel/modifyModel')}
              className="w-full mb-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-md"
            >
              Modify Domain Model
            </Button>
          )}

          <h2 className="mb-3 text-lg font-semibold text-gray-800">Filters</h2>

          <select
            className="w-full p-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={handleDropDownFilter}
          >
            <option value="all">All</option>
            {Object.entries(filterOptions).map(([tag]) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
