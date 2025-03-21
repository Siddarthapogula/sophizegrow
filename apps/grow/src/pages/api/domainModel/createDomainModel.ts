import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../prismaDb/prisma"; // Ensure correct import path

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { name, description, nodes, edges } = req.body;

  const Nodes = nodes.map((node: any) => ({
    id: node.id,
    label: node.data.label,
    tag : node.data.tag,
    positionX: node.position.x,
    positionY: node.position.y,
  }))

  const Edges = edges.map((edge: any) => ({
    id: edge.id,
    sourceNodeId: edge.source,
    targetNodeId: edge.target,
    label: edge.label??"",
  }))


  try {
    const graph = await Prisma.domainModelGraph.create({
      data: {
        name,
        description,
      },
    });

    if (nodes.length > 0) {
      await Prisma.domainModelNode.createMany({
        data: Nodes.map((node : any) => ({
          ...node,
          domainModelGraphId: graph.id, 
        })),
      });
    }

    if (edges.length > 0) {
      await Prisma.domainModelEdge.createMany({
        data: Edges.map((edge : any) => ({
          ...edge,
          domainModelGraphId: graph.id, 
        })),
      });
    }

    return res.status(200).json({ message: "Graph created successfully.", graphId: graph.id });
  } catch (error) {
    console.error("Error creating graph:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
