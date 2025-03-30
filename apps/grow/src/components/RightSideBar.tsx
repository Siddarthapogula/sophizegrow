import { Button } from "@grow/shared";
import { useRouter } from "next/navigation";

export default function RightSideBar() {
    const router = useRouter();
    return (
      <div className="w-[23%] p-4 bg-white border border-gray-300 shadow-md rounded-lg">
      <Button 
        onClick={() => router.push('/domainModel')} 
        className="w-full mb-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded-md"
      >
        Domain Model
      </Button>
      
      <h1 className="mb-3 text-lg font-semibold text-teal-800">Help</h1>
      
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-center gap-2">
          ➤ Right-click on canvas to add a node
        </li>
        <li className="flex items-center gap-2">
          ➤ Right-click on a node to delete it
        </li>
        <li className="flex items-center gap-2">
          ➤ Right-click on an edge to delete it
        </li>
        <li className="flex items-center gap-2">
          ➤ Click on an edge to edit its label
        </li>
        <li className="flex items-center gap-2">
          ➤ Hover on a node to get its suggestion nodes
        </li>
      </ul>
    </div>
    
    )
}