import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteBillUseCase } from './DeleteBillUseCase';

class DeleteBillController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteBillUseCase = container.resolve(DeleteBillUseCase);
    await deleteBillUseCase.execute({
      id,
    });

    return response.sendStatus(204);
  }
}

export { DeleteBillController };
