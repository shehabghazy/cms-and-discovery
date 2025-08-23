import { QueryUseCase } from '../../../shared/index.js';
import type { AssetDto } from '../contracts/get-asset-details-contract.js';
import { type AssetRepository } from '../../domain/index.js';
import { toAssetDto } from '../mappers/asset-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type GetAssetDetailsInput = { 
  assetId: string;
};

export type GetAssetDetailsOutput = { 
  asset: AssetDto;
};

export class GetAssetDetailsUseCase extends QueryUseCase<GetAssetDetailsInput, GetAssetDetailsOutput> {
  constructor(private readonly assetRepository: AssetRepository) {
    super();
  }
  
  async execute(input: GetAssetDetailsInput): Promise<GetAssetDetailsOutput> {
    const { assetId } = input;
    
    // Find asset by ID
    const asset = await this.assetRepository.findById(assetId);
    
    if (!asset) {
      throw new NotFoundError(`Asset with ID '${assetId}' not found`);
    }
    
    return { asset: toAssetDto(asset) };
  }
}
