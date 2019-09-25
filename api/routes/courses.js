const express = require('express');
const router = express.Router();
const authenticateUser = require("../authenticationUser");
const {Course} = require("../models");
const {User} = require("../models");
const auth = require('basic-auth');


function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
//Filter out properties for the router get request for User and Course(password & creatAt's)
//**Extra credit **
const filterOut = {
    include: [{
        model: User,
        attributes: { exclude: ['password','createdAt','updatedAt'] }
    }],
    attributes: { exclude: ['createdAt','updatedAt'] }

};

//Send a GET request to return a list of courses
router.get('/', async (req, res, ) => {
    Course.findAll(filterOut).then(courses => {
        if (courses) {
            res.status(200).json(courses);
        } else {
            res.status(404).json({message: "Sorry, try again."});
        }
    });
});

//Set GET to return course incl the user for course ID
router.get('/:id',async ( req, res, next ) => {
    let err = {};
    const courses = await Course.findByPk(req.params.id,filterOut);
    if (courses == null) {
        err.message = 'Course not found'
        err.status = 404;
        next(err);
    } else {
        res.status(200).json(courses);
    } 
    
});

//Set POST route creating a course, sets the location header to "/", returns no content
router.post('/', authenticateUser, async ( req, res, next ) => {
    const { title, description, estimatedTime, materialsNeeded } = req.body;
    const userId = req.currentUser.id
    
    try{

        await Course.create({
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        });

        res.location(`${req.originalUrl}/${req.currentUser.id}`);
        res.status(201);
        res.end();
} catch (err) {

    if(err.name === 'SequelizeValidationError'){
        err.message = err.errors.map(val => val.message);    
        err.status = 400;
    }

    next(err);
    }
});

 

  //Set a PUT request to /courses/:id to UPDATE a course  
  //***This method includes the extra credit feature validating courses can
  //only by edited by the actual user***
  router.put('/:id', authenticateUser, async (req, res, next) => {

    const { title, description, estimatedTime, materialsNeeded } = req.body;
    
    const userId = req.currentUser.id
    const err = new Error;

    try {
    
    const course = await Course.findByPk(req.params.id);
    
    if (Object.keys(req.body).length === 0) {
        err.status = 400;
        err.message = "No empty objects";
        throw err;
    }
    if (course === null) {
    
    err.status = 404;
    err.message = 'Could not find the requested course';
    
    throw err;
    }
    else {
    const actualUserId = course.toJSON().userId;
    
    if (userId === actualUserId) {
    
        await Course.update({
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        },
        {
            where: {
                id: `${req.params.id}`,
                userId: `${userId}`
            }
        });
        res.status(204).end();
    } 
    else {
    err.status = 403;
    err.message = 'Course userId and authenticated userId do not match. You can only update your course';
    
    throw err;
    }
    }
    
    } catch (err) {
    
    if (err.name === 'SequelizeValidationError') {
    err.message = err.errors.map(value => value.message);
    err.status = 400;
    }
    
    next(err);
    }
    });
    
//Send a DELETE reuest to DELETE a course
router.delete('/:id', authenticateUser, async (req, res, next) => {
    try {
        const userId = req.currentUser.id
        const err = new Error;

        const course = await Course.findByPk(req.params.id);

        if (course === null) {
            err.status = 404;
            err.message = "Course was not found";
            throw err;
        } else {
            const actualUserId = course.toJSON().userId;

            if (userId === actualUserId) {

                await course.destroy(course);
                res.status(204).end();
            }
            else {
                err.status = 403;
                err.message = 'Course userId and authenticated userId do not match. You can only delete your course';
                throw err;
            }
       }
    } catch (err) {
        next(err);

    }
});
        
module.exports = router;