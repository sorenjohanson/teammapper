import { MapSnapshot, ExportNodeProperties } from '@mmp/map/types';
import { CachedMapOptions } from 'src/app/shared/models/cached-map.model';

interface ResponseServer {
  // socket id of the triggering client, to prevent endless update loops
  clientId: string;
}

interface ResponseMapUpdated extends ResponseServer {
  map: ServerMap;
}

interface ResponseSnapshotChanges {
  [k: string]: Partial<MapSnapshot> | undefined
}

interface ResponseMapDiff {
  added: ResponseSnapshotChanges
  deleted: ResponseSnapshotChanges
  updated: ResponseSnapshotChanges
}

interface ResponseUndoRedoChanges extends ResponseServer {
  diff: ResponseMapDiff
}

interface ResponseMapOptionsUpdated extends ResponseServer {
  options: CachedMapOptions;
}

interface ResponseNodeUpdated extends ResponseServer {
  node: ExportNodeProperties;
  property: string;
}

interface ResponseNodesAdded extends ResponseServer {
  nodes: ExportNodeProperties[];
}

interface ResponseClientNotification {
  clientId: string;
  message: string;
  type: 'error' | 'warning' | 'success';
}

interface ResponseNodeRemoved extends ResponseServer {
  nodeId: string;
}

interface ResponseSelectionUpdated extends ResponseServer {
  nodeId: string;
  selected: boolean;
}

interface ServerMap {
  uuid: string;
  lastModified: string;
  deletedAt: string;
  deleteAfterDays: number;
  data: MapSnapshot;
  options: CachedMapOptions;
  createdAt: string;
}

interface PrivateServerMap {
  map: ServerMap;
  adminId: string;
  modificationSecret: string;
}

export {
  ResponseMapUpdated,
  ResponseUndoRedoChanges,
  ResponseMapOptionsUpdated,
  ResponseNodesAdded,
  ResponseNodeRemoved,
  ResponseNodeUpdated,
  ResponseSelectionUpdated,
  ResponseClientNotification,
  ServerMap,
  PrivateServerMap,
};
