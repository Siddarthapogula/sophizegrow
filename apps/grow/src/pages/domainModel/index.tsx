import { Button } from '@grow/shared';
import React, { useEffect, useMemo, useState } from 'react';
import { Background, ReactFlow } from '@xyflow/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {Edge, Graph, Node} from  "@lib/type-utils"

export default function DashboardLayout() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [filteredEdges, setFilteredEdges] = useState<Edge[]>([]);

  const [graphData, setGraphData] = useState<Graph|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const getGraphData = async () => {
      try {
        const { data } = await axios.get(`/api/domainModel/getDomainModel`);
        setGraphData(data);
        console.log(data);
        setNodes(data.nodes);
        setEdges(data.edges);
        setFilteredEdges(data.edges);
        setFilteredNodes(data.nodes);
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
      (node: Node) =>
        node?.data.tag === filter ||
        (node?.data.tag && node?.data.tag.includes(filter))
    );

    const selectedNodeIds = new Set(initialNodes.map((node: Node) => node.id));

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

    const filteredNodesList = nodes.filter((node: Node) =>
      selectedNodeIds.has(node.id)
    );
    const filteredEdgesList = edges.filter(
      (edge: Edge) =>
        selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    );

    setFilteredNodes(filteredNodesList);
    setFilteredEdges(filteredEdgesList);
  };

  const filterOptions = useMemo(() => {
    return (graphData as Graph)?.nodes?.reduce((acc: any, node: Node) => {
      if (node?.data.tag) {
        acc[node.data.tag] = (acc[node.data.tag] || 0) + 1;
      }
      return acc;
    }, {}) || {};
  }, [graphData]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-between items-center p-3 bg-gray-100 border-b border-gray-300">
        <Button
          onClick={() => router.push('/domainModel/modifyModel')}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Modify
        </Button>
      </div>
      <div className="flex flex-row w-full h-full">
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p>{error}</p>
            </div>
          ) : filteredNodes.length ? (
            <ReactFlow nodes={filteredNodes} edges={filteredEdges} fitView>
              <Background />
            </ReactFlow>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No graph data available for the selected filter.</p>
            </div>
          )}
        </div>
        <div className="w-1/4 p-4 border-l border-gray-300 overflow-y-auto bg-gray-100">
          <h2 style={{ marginBottom: '1rem' }}>Filters</h2>
          <select
            className="w-full p-2 mb-4 border border-gray-300 rounded"
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
