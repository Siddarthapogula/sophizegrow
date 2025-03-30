import axios from "axios";


export async function getResourcesOfNode(nodeId: string) {
  const { data } = await axios.get(`/api/domainModel/node/getResources?nodeId=${nodeId}`);
  return data;
}

export async function addResourceToNode(resource :any){
  const {data} = await axios.post('/api/domainModel/node/addResource', resource);
  return data;
}


export async function deleteResourceOfNode(resourceId : string){
  const {data} = await axios.post(`/api/domainModel/node/deleteResource`, {resourceId});
  return data;
}

export async function updateResourceOfNode(resource :any){
  const {data} = await axios.post('/api/domainModel/node/updateResource', resource);
  return data;
}

export async function getDomainModel(){
  const {data} = await axios.get('/api/domainModel/getDomainModel');
  return data;
}

export async function addNodeToGraph(node :any){
  const {data} = await axios.post('/api/domainModel/update/addNode', node);
  return data;
}

export async function addEdgeToGraph(edge :any){
  const {data} = await axios.post('/api/domainModel/update/addEdge', edge);
  return data;
}


export async function deleteNodeFromGraph(edgeId : string, nodeId : string){
  const {data} = await axios.post('/api/domainModel/update/deletenode', {edgeId, nodeId});
  return data;
}

export async function deleteEdgeWithId(edgeId : string){
  console.log(edgeId); 
  const {data} = await axios.post('/api/domainModel/update/deleteEdge', {edgeId});
  return data;
}


export async function addLabelToEdge({id, label}: any){
  const {data} = await axios.post('/api/domainModel/update/updateEdgeLabel', {id, label});
  return data;
}