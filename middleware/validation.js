import Joi from 'joi';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route parameters',
        details: error.details.map((d) => d.message),
      });
    }

    req.params = value;
    next();
  };
};

// Export Joi for schema creation in one place if needed
export { Joi };