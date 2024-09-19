import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIDController,
  patchContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../utils/validateBody.js';

import {
  addContactValidationSchema,
  patchContactValidationSchema,
} from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIDController));

router.post(
  '/',
  validateBody(addContactValidationSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(patchContactValidationSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;