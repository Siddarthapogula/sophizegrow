import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@grow/shared';
import { Handle, Position } from '@xyflow/react';

export default function NormalNodes({ data, ...props }: any) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-pink-200 p-4 rounded-lg">
            <h1>{data.label}</h1>
            <Handle type="target"  position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
          </div>  
        </TooltipTrigger>
        <TooltipContent className=' bg-white shadow-md' sideOffset={5}>
          <div className=" rounded-lg">
            <h1 className="text-lg text-blue-400 font-semibold">{data.label}</h1>
            <h1 className="text-sm text-teal-900 font-semibold">{data.description}</h1>
          </div>description
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
