export interface Node {
  id: string;
  data: { label?: string; tag?: string };
  position?: { x: number; y: number };
  description?: string;
  type: 'NORMAL' | 'LOADING' | 'CERTIFIED';
}
export interface Edge {
  id: string;
  label: string;
  source: string;
  target: string;
}

export interface Graph {
  id: string;
  name: string;
  description: string;
  edges: Edge[];
  nodes: Node[];
}

export interface Resource {
  id: string;
  domainModelNodeId: string;
  title: string;
  description: string;
  url: string;
}
export interface User {
  id: string;
  name: string | null;
  email: string;
  organizationId?: string;
  isAdmin: boolean;
}
export interface Certificate {
  id: string;
  abilityId: string;
  certifierId: string;
  learnerId: string;
  certifiedAt: string;
}
export interface DomainModel {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
}
