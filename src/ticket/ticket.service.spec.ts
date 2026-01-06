import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { OpenAiProvider } from '../llm/openai.provider';
import { ConfigService } from '@nestjs/config';

describe('TicketService', () => {
  let service: TicketService;
  let llmProviderMock: { generateResponse: jest.Mock };
  let configServiceMock: { get: jest.Mock };

  beforeEach(async () => {
    llmProviderMock = {
      generateResponse: jest.fn(),
    };
    configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'OPENAI_TOKEN_COST_PER_1M_INPUT') return 1.75;
        if (key === 'OPENAI_TOKEN_COST_PER_1M_OUTPUT') return 14.0;
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: OpenAiProvider,
          useValue: llmProviderMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('triageTicket returns parsed response and cost', async () => {
    const mockLlmOutput = {
      finalOutput: JSON.stringify({
        category: 'technical',
        priority: 'high',
        flags: {
          requires_human: true,
          is_abusive: false,
          missing_info: false,
          is_vip_customer: false,
        },
      }),
      state: {
        _lastTurnResponse: {
          usage: {
            inputTokens: 100,
            outputTokens: 20,
          },
        },
      },
    };
    llmProviderMock.generateResponse.mockResolvedValue(mockLlmOutput);

    const result = await service.triageTicket('subject', 'body');
    expect(result).toEqual({
      category: 'technical',
      priority: 'high',
      flags: {
        requires_human: true,
        is_abusive: false,
        missing_info: false,
        is_vip_customer: false,
      },
      usage: {
        inputTokens: 100,
        outputTokens: 20,
        costUSD: (100 / 1_000_000) * 1.75 + (20 / 1_000_000) * 14.0,
      },
    });
    expect(llmProviderMock.generateResponse).toHaveBeenCalledWith(
      expect.stringContaining('subject'),
    );
  });
});
