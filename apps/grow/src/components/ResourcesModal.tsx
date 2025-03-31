import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@grow/shared';
import { Resource } from '../lib/type-utils';

export default function ResourceModal({
  modalState,
  selectedNode,
  selectedNodeResources,
  setModalState,
  resourceFormDetails,
  setResourceFormDetails,
  setSelectedNodeResources,
  handleAddResource,
  handleUpdateResource,
  deleteResource,
  canModify,
}: any) {
  const closeModal = () => {
    setModalState({
      ...modalState,
      isModalOpen: false,
      isEditMode: false,
      isAddingResource: false,
      isUpdating: false,
      updatingResource: null,
    });
    if (canModify) {
      setResourceFormDetails({ title: '', description: '', url: '' });
    }
    setSelectedNodeResources([]);
  };

  return (
    <Dialog open={modalState.isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[400px] p-4 space-y-4 bg-white rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-indigo-600">
            {selectedNode?.data?.label} Details
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Description of the node.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-md font-semibold text-gray-700">Resources:</h1>
            {canModify && (
              <Button
                onClick={() => {
                  setModalState({
                    ...modalState,
                    isEditMode: !modalState.isEditMode,
                    isAddingResource: false,
                    isUpdating: false,
                  });
                }}
                className="bg-indigo-500 text-white px-3 py-1 text-sm"
              >
                {modalState.isEditMode ? 'Done' : 'Edit'}
              </Button>
            )}
          </div>

          {canModify && modalState.isEditMode && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setModalState({
                    ...modalState,
                    isAddingResource: true,
                    isUpdating: false,
                  });
                  setResourceFormDetails({
                    title: '',
                    description: '',
                    url: '',
                  });
                }}
                className="bg-green-500 text-white px-3 py-1 text-sm"
              >
                Add
              </Button>
            </div>
          )}
          {selectedNodeResources.length === 0 ? (
            <p className="text-gray-400 italic">No resources found</p>
          ) : (
            selectedNodeResources.map((resource: Resource, index: any) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm hover:bg-gray-100 transition"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h1 className="font-medium text-md text-blue-600">
                    {resource.title}
                  </h1>
                </a>
                <p className="text-gray-600 text-xs mb-1">
                  {resource?.description}
                </p>
                {canModify && modalState.isEditMode && (
                  <div className="flex space-x-1 mt-1">
                    <Button
                      className="bg-yellow-500 text-white px-2 py-1 text-xs"
                      onClick={() => {
                        setResourceFormDetails({
                          title: resource.title,
                          description: resource.description,
                          url: resource.url,
                        });
                        setModalState({
                          ...modalState,
                          isUpdating: true,
                          isAddingResource: false,
                          updatingResource: resource,
                        });
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => deleteResource(resource.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {canModify &&
          (modalState.isAddingResource || modalState.isUpdating) && (
            <div className="space-y-2 border-t pt-2">
              <label className="block text-gray-700 font-medium text-sm">
                Title
              </label>
              <input
                type="text"
                value={resourceFormDetails.title}
                onChange={(e) =>
                  setResourceFormDetails({
                    ...resourceFormDetails,
                    title: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
              />
              <label className="block text-gray-700 font-medium text-sm">
                Description
              </label>
              <input
                type="text"
                value={resourceFormDetails.description}
                onChange={(e) =>
                  setResourceFormDetails({
                    ...resourceFormDetails,
                    description: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
              />
              <label className="block text-gray-700 font-medium text-sm">
                URL
              </label>
              <input
                type="text"
                value={resourceFormDetails.url}
                onChange={(e) =>
                  setResourceFormDetails({
                    ...resourceFormDetails,
                    url: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 w-full focus:ring focus:ring-indigo-300 text-sm"
              />
              {
                <Button
                  onClick={() => {
                    if (modalState.isAddingResource) {
                      handleAddResource();
                    } else {
                      handleUpdateResource();
                    }
                  }}
                  className="bg-blue-500 text-white w-full mt-1 text-sm"
                >
                  {modalState.isAddingResource ? 'Add' : 'Update'}
                </Button>
              }
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
