import express from 'express';
import contactsControllers from '../../controllers/contacts-controller.js';
import {authenticate, isEmptyBody, isValidId} from "../../middlewares/index.js";
import { contactAddScema, contactUpdateSchema, contactUpdateFavoriteSchema } from '../../models/Contact.js';
import {validateBody} from "../../decorators/index.js";


const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsControllers.getListContacts);

contactsRouter.get('/:id', isValidId, contactsControllers.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactAddScema), contactsControllers.addContact);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsControllers.updateContactsById);

contactsRouter.patch("/:id/favorite", isValidId, isEmptyBody, validateBody(contactUpdateFavoriteSchema), contactsControllers.updateContactsById);

contactsRouter.delete('/:id', isValidId, contactsControllers.deleteContact);



export default  contactsRouter
