import { Test, TestingModule } from '@nestjs/testing';
import { ChunkBedderController } from './chunk-bedder.controller';

describe('ChunkBedderController', () => {
  let controller: ChunkBedderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChunkBedderController],
    }).compile();

    controller = module.get<ChunkBedderController>(ChunkBedderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
