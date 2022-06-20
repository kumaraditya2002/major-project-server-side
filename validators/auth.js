const {check, validationResult}=require('express-validator');

exports.validateSignupRequest=[
    check('name')
    .notEmpty()
    .withMessage('Name is required'),
    check('email')
    .isEmail()
    .withMessage('Valid email is required'),
    check('contact')
    .notEmpty()
    .isNumeric()
    .isLength(10)
    .withMessage('Valid contact is required'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be atleast 6 characters long'),
    check('category')
    .notEmpty()
    .withMessage('Category is required'),
    check('locality')
    .notEmpty()
    .withMessage('Locality is required'),
    check('city')
    .notEmpty()
    .withMessage('City is required')
];
exports.validateUserSignupRequest=[
    check('name')
    .notEmpty()
    .withMessage('Name is required'),
    check('email')
    .isEmail()
    .withMessage('Valid email is required'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be atleast 6 characters long')
];
exports.validateSigninRequest=[
    check('email')
    .isEmail()
    .withMessage('Valid email is required'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be atleast 6 characters long')
];

exports.isSignupRequestValidated=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.array().length >0){
        return res.status(400).json({ok:false,error:errors.array()[0].msg});
    }
    next();
}
exports.isUserSignupRequestValidated=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.array().length >0){
        return res.status(400).json({ok:false,error:errors.array()[0].msg});
    }
    next();
}

exports.isSigninRequestValidated=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.array().length >0){
        return res.status(400).json({ok:false,error:errors.array()[0].msg});
    }
    next();
}