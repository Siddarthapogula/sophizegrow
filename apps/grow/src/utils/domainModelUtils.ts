import dagre from '@dagrejs/dagre';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

/*
    takes the nodes and edges of a graph 
    and returns the nodes and edges with their positions dynamically calculated,
*/
export const getDynamicalLayoutElements = (nodes: any, edges: any) => {
  const isHorizontal = false;
  dagreGraph.setGraph({ rankdir: isHorizontal ? 'LR' : 'TB' });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  const newNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
  return { nodes: newNodes, edges };
};
