import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  message: Joi.string().required(),
  type: Joi.string().valid('text', 'video-call', 'voice-call').required()
});

export const callSchema = Joi.object({
  callType: Joi.string().valid('video', 'voice').required(),
  offer: Joi.object().optional()
});

export const offerSchema = Joi.object({
  offer: Joi.object().required()
});

export const answerSchema = Joi.object({
  answer: Joi.object().required()
});

export const iceCandidateSchema = Joi.object({
  candidate: Joi.object().required()
});