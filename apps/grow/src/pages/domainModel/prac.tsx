// import {
//   Background,
//   ReactFlow,
//   Edge,
//   addEdge,
//   applyNodeChanges,
// } from '@xyflow/react';
// import SuccessiveNodes from '../../components/SuccessiveNodes';
// import { use, useEffect, useRef, useState } from 'react';
// import NormalNodes from '../../components/normalNodes';
// import axios from 'axios';

// export default function Practice() {
//   const nodeType = { successive: SuccessiveNodes, normal: NormalNodes };
//   let ids = Math.random().toString(36).substring(7);

//   const [nodes, setNodes] = useState([
//     {
//       id: '1',
//       type: 'normal',
//       data: {
//         label: 'Data Engineer',
//         name: 'Data Engineer',
//         description:
//           'Data Engineer guy excelled in problem solving, anlyzes the data,  building highly efficient tech models',
//         position: { x: 300, y: 0 },
//         nodeId: '1',
//         handleAddClick: (data) => handleAddClick(data),
//       },
//       position: { x: 300, y: 0 },
//     },
//   ]);

//   const [edges, setEdges] = useState([]);

//   const [genAiNodes, setGenAiNodes] = useState([]);
//   const [genAiEdges, setGenAiEdges] = useState([]);
//   const genAiNodesRef = useRef([]);
//   const genAiEdgesRef = useRef([]);

//   useEffect(() => {
//     genAiEdgesRef.current = genAiEdges;
//   }, [genAiNodes]);
//   useEffect(() => {
//     genAiNodesRef.current = genAiNodes;
//   }, [genAiEdges]);

//   const handleAddClick = (data: any) => {
//     const curNode = genAiNodesRef.current.find(
//       (nd: any) => nd.id === data.nodeId
//     );
//     const curEdge = genAiEdgesRef.current.find(
//       (edge: any) => edge.target === data.nodeId
//     );

//     if (!curNode || !curEdge) {
//       console.warn('Node or Edge not found for', data.nodeId);
//       return;
//     }

//     const updatedNodes = genAiNodesRef.current.filter(
//       (nd: any) => nd.id !== data.nodeId
//     );
//     const updatedEdges = genAiEdgesRef.current.filter(
//       (edge: any) => edge.target !== data.nodeId
//     );

//     setGenAiNodes(updatedNodes);
//     setGenAiEdges(updatedEdges);

//     genAiNodesRef.current = updatedNodes;
//     genAiEdgesRef.current = updatedEdges;

//     const newNode = {
//       id: data.nodeId,
//       type: 'normal',
//       data: {
//         label: curNode.data.label,
//         nodeId: curNode.id,
//         description: curNode.data.description,
//         name: curNode.data.name,
//         handleAddClick: (data) => handleAddClick(data),
//       },
//       position: curNode?.position,
//     };

//     const newEdge = {
//       id: `e${curEdge.source}-${data.nodeId}`,
//       source: curEdge.source,
//       target: data.nodeId,
//     };

//     setNodes((prevNodes) => [...prevNodes, newNode]);
//     setEdges((prevEdges) => [...prevEdges, newEdge]);
//   };

//   const debouncerTimeout = useRef<any>(null);

//   async function handleNodeHover(event, node) {
//     if (debouncerTimeout.current) clearTimeout(debouncerTimeout.current);
//     if (genAiNodes.find((nd: any) => nd.id === node.id)) return;
//     debouncerTimeout.current = setTimeout(async () => {
//       const { data } = await axios.post('/api/gen-ai/exp', {
//         name: node.data.name,
//         description: node.data.description,
//         tags: node.data?.tags,
//         resources: node.data?.resources,
//       });
//       let nodeSpacingX = 250;
//       let nodeSpacingY = 150;
//       const newNodes = data?.map((nd, index) => {
//         return {
//           id: nd.id,
//           type: 'successive',
//           data: {
//             label: nd.name,
//             description: nd.description,
//             name: nd.name,
//             position: {
//               x:
//                 node.position.x +
//                 (index - Math.floor(data.length / 2)) * nodeSpacingX,
//               y: node.position.y + nodeSpacingY,
//             },
//             nodeId: nd.id,
//             handleAddClick: (data) => handleAddClick(data),
//           },
//           position: {
//             x:
//               node.position.x +
//               (index - Math.floor(data.length / 2)) * nodeSpacingX,
//             y: node.position.y + nodeSpacingY,
//           },
//         };
//       });
//       const newEdges = data?.map((nd) => {
//         return {
//           id: `e${node.id}-${nd.id}`,
//           source: node.id,
//           target: nd.id,
//         };
//       });
//       setGenAiEdges(newEdges);
//       setGenAiNodes(newNodes);
//     }, 1000);
//   }

//   const onConnect = (params: any) => {
//     (setEdges as any)((eds: any) => addEdge(params, eds));
//   };

//   const onChange = (changes: any) => {
//     setNodes((nds: any) => applyNodeChanges(changes, nds));
//   };

//   return (
//     <div className="w-full h-screen relative">
//       <ReactFlow
//         nodes={[...nodes, ...genAiNodes]}
//         edges={[...edges, ...genAiEdges]}
//         nodeTypes={nodeType}
//         fitView={true}
//         onConnect={onConnect}
//         onNodesChange={onChange}
//         onNodeMouseEnter={handleNodeHover}
//         onNodeMouseLeave={() => clearTimeout(debouncerTimeout.current)}
//       >
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// }


export default function Prac(){
    return (
        <div>experiments</div>
    )
}