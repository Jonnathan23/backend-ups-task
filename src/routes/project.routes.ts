import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/Task.controller";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/Team.controller";

const router = Router();
router.use(authenticate)

router.param('projectId', projectExists)

router.get('/',
    handleInputErrors,
    ProjectController.getAllProjects
)

router.get('/:projectId',
    param('projectId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('El id no es válido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    ProjectController.deleteProject
)


/* Routes for task */


router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    handleInputErrors,
    TaskController.getProjectTasks
)

// TaskId
router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id no es válido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('El id no es válido'),
    body('status').notEmpty().withMessage('El status de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTaskStatus
)

//* |-----| | Routes for team | |-----| 
router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('El email no es válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    handleInputErrors,
    TeamMemberController.getProjectTeam    
)


router.post('/:projectId/team',    
    body('id').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('El id no es válido'),    
    handleInputErrors,
    TeamMemberController.removeMemberById
)

export default router