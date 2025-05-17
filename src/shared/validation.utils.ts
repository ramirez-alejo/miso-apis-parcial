import { BusinessError, BusinessErrorType } from './business-error';

export class ValidationUtils {

  public static validateUUID(id: string, entityName: string): void {
    if (!id || id.trim() === '') {
      throw new BusinessError(
        `El ID del ${entityName} no puede estar vacío`,
        BusinessErrorType.BAD_REQUEST
      );
    }
    
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      throw new BusinessError(
        `El ID del ${entityName} no tiene un formato válido`,
        BusinessErrorType.BAD_REQUEST
      );
    }
  }
}