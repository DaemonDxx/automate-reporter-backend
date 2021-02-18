import { Test, TestingModule } from '@nestjs/testing';
import { TemplaterController } from './templater.controller';

describe('TemplaterController', () => {
  let controller: TemplaterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplaterController],
    }).compile();

    controller = module.get<TemplaterController>(TemplaterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
