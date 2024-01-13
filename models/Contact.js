import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";
import Joi from 'joi';

const phoneRegexp =  /^\(\d{3}\) \d{3}-\d{4}$/;

const contactSchema = new Schema({
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true
    },
    phone: {
        type: String,
        match: phoneRegexp,
        require:true
    },
    favorite: {
        type: Boolean,
        default:false
    },
    avatar: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, 
{versionKey: false, timestamps: true});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddScema = Joi.object ({
    name: Joi.string().required().messages({
        "any.required": `"name" must be exist`
    }),
    email: Joi.string().required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    favorite: Joi.boolean(),
})

export const contactUpdateFavoriteSchema = Joi.object ({
    favorite: Joi.boolean().required()
})

export const contactUpdateSchema = Joi.object ({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string().pattern(phoneRegexp),
    favorite: Joi.boolean(),

})

const Contact = model("contact", contactSchema);

export default Contact;
