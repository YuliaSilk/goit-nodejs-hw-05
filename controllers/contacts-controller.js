import Contact, { contactUpdateFavoriteSchema, contactUpdateSchema } from '../models/Contact.js';
import {HttpError} from '../helpers/index.js';
import {ctrlWrapper} from '../decorators/index.js';

const getListContacts = async(req, res) => {
  const {_id: owner } = req.user;
  const {page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email");
  res.json(result);  
  }

const getById = async (req, res, next) => {
  const { id: _id } = req.params;
  const {_id: owner } = req.user;
  const result = await User.findOne({_id, owner});
  if(!result) {
            throw HttpError(404);
        }
  res.json(result);
  }


const addContact = async (req, res) => {
  const {_id: owner } = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result)  
  }

const updateContactsById = async (req, res) => {   
  const { id: _id } = req.params;
  const {_id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({_id, owner}, req.body);
  if(!result) {
      throw HttpError(404, `Not found`);
  }
  res.json(result);        
}

const deleteContact = async (req, res) => { 
  const { id } = req.params;
  const {_id: owner } = req.user;
  const result = await Contact.findOneAndDelete({_id, owner});
   if(!result) {
     throw HttpError(404, `Not found`);
    }
  res.json({ message: 'Contact deleted successfully' })
  }  

    export default {
        getListContacts: ctrlWrapper(getListContacts),
        getById: ctrlWrapper(getById),
        addContact: ctrlWrapper(addContact),
        updateContactsById: ctrlWrapper(updateContactsById),
        deleteContact: ctrlWrapper(deleteContact),
    }