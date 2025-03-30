import { Handle, Position } from "@xyflow/react";

export default function NodesSkeleton({data} : any){
    return (
        <div className=" bg-gray-300 p-5  w-[100px] rounded-lg animate-pulse">
            <Handle  type="source" style={{visibility: 'hidden'}}  position={Position.Bottom} />
            <Handle  type="target" style={{visibility: 'hidden'}} position={Position.Top} />
        </div>  
    )
}