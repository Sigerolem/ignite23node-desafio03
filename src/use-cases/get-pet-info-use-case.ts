import { PetsRepository } from "src/repositories/pets-repository";

export class GetPetInfoUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute(id: string) {
    const pet = await this.petsRepository.getPetDetails(id)
    return pet
  }
}