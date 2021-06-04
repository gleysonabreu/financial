import { InMemoryPermissionsRepository } from '@modules/permissions/repositories/in-memory/InMemoryPermissionsRepository';
import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';

import { DeletePermissionError } from './DeletePermissionError';
import { DeletePermissionUseCase } from './DeletePermissionUseCase';

let permissionsRepository: IPermissionsRepository;
let deletePermissionUseCase: DeletePermissionUseCase;
describe('DeletePermissionUseCase', () => {
  beforeEach(() => {
    permissionsRepository = new InMemoryPermissionsRepository();
    deletePermissionUseCase = new DeletePermissionUseCase(
      permissionsRepository,
    );
  });

  it('should be able to delete a permission', async () => {
    const permission = await permissionsRepository.create({
      userId: '9907ceee-fb10-4057-92fb-8372ad238d52',
      type: 'ADMIN',
    });

    const response = await deletePermissionUseCase.execute({
      id: permission.id,
    });

    expect(response).toBeUndefined();
  });

  it('should not be able to delete a permission with wrong id', async () => {
    await expect(async () => {
      await deletePermissionUseCase.execute({
        id: '9907ceee-fb10-4057-92fb-8372ad238d52',
      });
    }).rejects.toBeInstanceOf(DeletePermissionError);
  });
});
