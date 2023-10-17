export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('Org with same e-mail/whatsapp already exists.')
  }
}