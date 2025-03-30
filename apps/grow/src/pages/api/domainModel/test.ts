import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req : NextApiRequest, res : NextApiResponse){
    let ids = Math.random().toString(36).substring(7);
    const nodes = [
        {
            id : ids+2,
            type : 'successive',
            data : {
                label : 'Node 2',
                nodeId : ids+2,
            },
        },
        {
            id : ids+3,
            type : 'successive',
            data : {
                label : 'Node 3',
                nodeId : ids+3,
            },
        },
        {
            id : ids+4,
            type : 'successive',
            data : {
                label : 'Node 4',
                nodeId : ids+4,
            },
        },
        {
            id : ids+5,
            type : 'successive',
            data : {
                label : 'Node 5',
                nodeId : ids+5,
            },
        },
        {
            id : ids+6,
            type : 'successive',
            data : {
                label : 'Node 6',
                nodeId : ids+6,
            },
        },
    ]
    return res.status(200).json(nodes);
}