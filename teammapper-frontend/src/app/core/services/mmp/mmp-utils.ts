import Node, { NodeProperties } from "@mmp/map/models/node";

const COLORS: string[] = [
  '#FFC107',
  '#2196F3',
  '#9C27B0',
  '#f44336',
  '#4CAF50',
  '#3F51B5',
  '#FF9800',
  '#CDDC39',
  '#795548',
  '#673AB7',
  '#009688',
  '#E91E63',
  '#03A9F4',
  '#8BC34A',
  '#00BCD4',
  '#607D8B',
  '#FFEB3B',
  '#FF5722',
];
const EMPTY_IMAGE_DATA = 'data:,';

const createEmptyClientNode = (nodeName: string, isRoot: boolean, parent: Node | ""): Node => {
  return new Node({
    id: crypto.randomUUID(),
    parent: parent || null,
    name: nodeName || "Root Node",
    coordinates: {
      x: null,
      y: null
    },
    colors: {
      name: "#666666",
      background: "#f5f5f5",
      branch: "",
    },
    image: {
      src: "",
      size: 70
    },
    font: {
      style: "normal",
      size: 26,
      weight: "normal",
      decoration: "",
    },
    link: {
      href: ""
    },
    locked: false,
    isRoot: isRoot || false,
    detached: false,
    hidden: false,
    hasHiddenChildNodes: false
  })
}

export { COLORS, EMPTY_IMAGE_DATA, createEmptyClientNode };
