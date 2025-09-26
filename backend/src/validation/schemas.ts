import Joi from 'joi';

export const fluencyTableSchema = Joi.object({
  roleTitle: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Role title must be at least 2 characters long',
    'string.max': 'Role title must be less than 100 characters',
    'any.required': 'Role title is required'
  }),
  industry: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Industry must be at least 2 characters long',
    'string.max': 'Industry must be less than 50 characters',
    'any.required': 'Industry is required'
  })
});

export const resourceRecommendationsSchema = Joi.object({
  roleTitle: Joi.string().min(2).max(100).required(),
  industry: Joi.string().min(2).max(50).required(),
  currentLevel: Joi.string().valid('Unskilled', 'Capable', 'Adoptive', 'Transformative').required().messages({
    'any.only': 'Current level must be one of: Unskilled, Capable, Adoptive, Transformative'
  })
});

export const learningPathSchema = Joi.object({
  roleTitle: Joi.string().min(2).max(100).required(),
  industry: Joi.string().min(2).max(50).required(),
  currentLevel: Joi.string().valid('Unskilled', 'Capable', 'Adoptive', 'Transformative').required(),
  targetLevel: Joi.string().valid('Unskilled', 'Capable', 'Adoptive', 'Transformative').required().messages({
    'any.only': 'Target level must be one of: Unskilled, Capable, Adoptive, Transformative'
  })
});

export const bookmarkSchema = Joi.object({
  resourceId: Joi.string().required(),
  userId: Joi.string().optional()
});

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    req.validatedData = value;
    next();
  };
};
