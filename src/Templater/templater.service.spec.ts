import { Test, TestingModule } from '@nestjs/testing';
import { TemplaterService } from './templater.service';

describe('TemplaterService', () => {
  let service: TemplaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplaterService],
    }).compile();

    service = module.get<TemplaterService>(TemplaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
