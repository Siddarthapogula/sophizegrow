import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@grow/shared';
import { Handle, Position } from '@xyflow/react';

export default function CertifiedNode({ data, ...props }: any) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative bg-gradient-to-br from-green-200 to-green-100 p-4 rounded-xl border-2 border-green-400 shadow-lg  flex flex-col gap-2 group transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold z-10">
              CERTIFIED
            </div>

            <h1 className="font-semibold text-green-900 text-center">
              {data.label}
            </h1>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-white shadow-md" sideOffset={5}>
          <div className="rounded-lg">
            <h1 className="text-lg text-green-600 font-semibold">
              {data.label}
            </h1>
            <h1 className="text-sm text-gray-700">{data.description}</h1>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
