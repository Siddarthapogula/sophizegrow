export interface Node {
    // id : string;
    // data : {label : string, tag : string};
    // position : {x : number, y : number};
}

export interface Edge {
    id : string;
    label : string;
    source : string;
    target : string;
}

export interface Graph {
    id : string;
    name : string;
    description : string;
    edges : Edge[];
    nodes : Node[];
}

export interface Resource {
    id : string;
    domainModelNodeId : string;
    title : string;
    description : string;
    url : string;
}