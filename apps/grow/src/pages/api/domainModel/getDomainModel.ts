import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    let graph;
    try{
        graph =  await Prisma.domainModelGraph.findFirst({
            include : {
                edges : true,
                nodes : true
            }
        });
        if(!graph) return res.json({message : 'Graph not found'});
    }catch(e){
        return res.json({message : 'Unable to connect to the database'});
    }
    const nodes = graph?.nodes.map((node : any)=>{
        return {
            id : node.id,
            description : node.description,
            type : node.type,
            data : {label : node.label, tag : node.tag},
            position : {x : Number(node.positionX), y : Number(node.positionY)}
        }
    })
    const edges = graph?.edges.map((edge : any)=>{
        return {
            id : edge.id,
            source : edge.sourceNodeId,
            target : edge.targetNodeId,
            label : edge.label
        }
    })
    const response = {
        id : graph.id,
        name : graph.name,
        description : graph.description,
        nodes,
        edges
    } 
    res.status(200).json(response);
}