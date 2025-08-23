import { CommandUseCase } from '../../../shared/index.js';
import type { AssetDto } from '../contracts/update-asset-availability-contract.js';
import { type AssetRepository } from '../../domain/index.js';
import { toAssetDto } from '../mappers/asset-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type UpdateAssetAvailabilityInput = { 
  assetId: string;
  isAvailable: boolean;
};

export type UpdateAssetAvailabilityOutput = { 
  asset: AssetDto;
};

export class UpdateAssetAvailabilityUseCase extends CommandUseCase<UpdateAssetAvailabilityInput, UpdateAssetAvailabilityOutput> {
  constructor(private readonly assetRepository: AssetRepository) {
    super();
  }
  
  async execute(input: UpdateAssetAvailabilityInput): Promise<UpdateAssetAvailabilityOutput> {
    const { assetId, isAvailable } = input;
    
    // Find asset by ID
    const asset = await this.assetRepository.findById(assetId);
    
    if (!asset) {
      throw new NotFoundError(`Asset with ID '${assetId}' not found`);
    }
    
    // Update availability using domain method (includes validation)
    asset.updateAvailability({ id: assetId, is_available: isAvailable });
    
    // Save updated asset
    await this.assetRepository.update(asset);
    
    return { asset: toAssetDto(asset) };
  }
}
