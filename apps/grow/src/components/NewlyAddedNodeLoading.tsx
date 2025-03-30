import { Button } from "@grow/shared";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Handle, Position } from "@xyflow/react";


export default function NewlyAddedNodeLoading({data} : any) {
    return (
      <div onClick={()=>data.handleAddSuccessiveNodeClick(data)} className="animate-pulse animation-delay-200 bg-orange-300 p-4 rounded-lg opacity-40">
        <h1>{data.label}</h1>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
}