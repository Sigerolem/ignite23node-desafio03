import { PetsRepository } from "src/repositories/pets-repository";

export interface petFilters {
  energy_level?: 'LOW' | 'MEDIUM' | 'HIGH',
  independency?: 'LOW' | 'MEDIUM' | 'HIGH',
  size?: 'SMALL' | 'MEDIUM' | 'BIG',
  space_need?: 'SMALL' | 'MEDIUM' | 'BIG',
  age?: 'YOUNG' | 'TEEN' | 'ADULT'
}

export class GetPetsUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute({ city, filters }: { city: string, filters: petFilters }) {
    const pets = await this.petsRepository.findByCity({ city, filters })
    return pets
  }
}