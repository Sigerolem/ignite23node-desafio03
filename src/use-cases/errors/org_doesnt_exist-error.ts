export class OrgDoesntExistError extends Error {
  constructor() {
    super("Org with provided Id doesn't exist.")
  }
}