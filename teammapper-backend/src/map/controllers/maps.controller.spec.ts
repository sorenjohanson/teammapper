import { Test, TestingModule } from '@nestjs/testing';
import MapsController from './maps.controller';
import { MapsService } from '../services/maps.service';
import { NotFoundException } from '@nestjs/common';
import { MmpMap } from '../entities/mmpMap.entity';
import { IMmpClientMap, IMmpClientPrivateMap } from '../types';
import { MmpNode } from '../entities/mmpNode.entity';
import { createClientRootNode, createMmpClientMap, createMmpMap } from '../utils/tests/mapFactories';
import MalformedUUIDError from '../services/uuid.error';

describe('MapsController', () => {
  let mapsController: MapsController;
  let mapsService: MapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapsController],
      providers: [
        {
          provide: MapsService,
          useValue: {
            findMap: jest.fn(),
            createEmptyMap: jest.fn(),
            findNodes: jest.fn(),
            addNodes: jest.fn(),
            exportMapToClient: jest.fn(),
            deleteMap: jest.fn(),
            updateLastAccessed: jest.fn(),
          },
        },
      ],
    }).compile();

    mapsController = module.get<MapsController>(MapsController);
    mapsService = module.get<MapsService>(MapsService);
  });

  describe('duplicate', () => {
    it('should duplicate a map correctly', async () => {
        const oldMap: MmpMap = createMmpMap({
          adminId: 'old-admin-id',
          modificationSecret: 'old-modification-secret'
        });
        const newMap: MmpMap = createMmpMap({
          adminId: 'new-admin-id',
          modificationSecret: 'new-modification-secret'
        });
        const exportedMap: IMmpClientMap = createMmpClientMap();
        const result: IMmpClientPrivateMap = {
            map: exportedMap,
            adminId: 'new-admin-id',
            modificationSecret: 'new-modification-secret'
        };

        jest.spyOn(mapsService, 'findMap').mockResolvedValueOnce(oldMap);
        jest.spyOn(mapsService, 'createEmptyMap').mockResolvedValueOnce(newMap);
        jest.spyOn(mapsService, 'findNodes').mockResolvedValueOnce(Array<MmpNode>());
        jest.spyOn(mapsService, 'addNodes').mockResolvedValueOnce([]);
        jest.spyOn(mapsService, 'exportMapToClient').mockResolvedValueOnce(exportedMap);

        const response = await mapsController.duplicate(oldMap.id);

        expect(response).toEqual(result);

        expect(newMap.name).toEqual(oldMap.name);
        expect(newMap.lastModified).toEqual(oldMap.lastModified);
    });

    it('should throw NotFoundException if old map is not found', async () => {
        const mapId = 'test-map-id';

        jest.spyOn(mapsService, 'findMap').mockRejectedValueOnce(new Error('MalformedUUIDError'));

        await expect(mapsController.duplicate(mapId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find the correct map', async () => {
      const mapId = 'e7f66b65-ffd5-4387-b645-35f8e794c7e7';
      const exportedMap: IMmpClientMap = createMmpClientMap({
        id: mapId,
      })

      jest.spyOn(mapsService, 'exportMapToClient').mockResolvedValueOnce(exportedMap);

      const response = await mapsController.findOne(mapId);

      expect(response).toEqual(exportedMap);
    });

    it('should throw a NotFoundException if the map wasn\'t found', async () => {
      const invalidMapId = 'map_id';

      jest.spyOn(mapsService, 'exportMapToClient').mockRejectedValueOnce(new MalformedUUIDError('MalformedUUIDError'));

      expect(mapsController.findOne(invalidMapId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing map successfully', async () => {
      const existingMap = createMmpMap();

      jest.spyOn(mapsService, 'findMap').mockResolvedValueOnce(existingMap);
      // We're not interested in testing the repository at this stage, only if the request gets past the admin ID check
      jest.spyOn(mapsService, 'deleteMap').mockImplementation(() => {});
      
      await mapsController.delete(existingMap.id, {
        adminId: existingMap.adminId,
        mapId: existingMap.id,
      });

      expect(mapsService.deleteMap).toHaveBeenCalledWith(existingMap.id);
    });

    it('should not delete a map if the wrong admin ID is given', async () => {
      const existingMap: MmpMap = createMmpMap();

      jest.spyOn(mapsService, 'findMap').mockResolvedValueOnce(existingMap);
      
      await mapsController.delete(existingMap.id, {
        adminId: 'wrong-admin-id',
        mapId: existingMap.id,
      });

      expect(mapsService.deleteMap).not.toHaveBeenCalledWith(existingMap.id);
    });
  });

  describe('create', () => {
    it('should create a new map if given a root node', async () => {
      const newMap: MmpMap = createMmpMap();

      const exportedMap: IMmpClientMap = createMmpClientMap({
        uuid: newMap.id,
      })

      const result: IMmpClientPrivateMap = {
          map: exportedMap,
          adminId: 'admin-id',
          modificationSecret: 'modification-secret'
      };

      const rootNode = createClientRootNode()

      jest.spyOn(mapsService, 'createEmptyMap').mockResolvedValueOnce(newMap);
      jest.spyOn(mapsService, 'exportMapToClient').mockResolvedValueOnce(exportedMap);

      const response = await mapsController.create({
        rootNode
      });

      expect(mapsService.createEmptyMap).toHaveBeenCalledWith(rootNode);
      expect(response).toEqual(result);
    });
  });
});