import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import queryValidationMiddleware from '@/middleware/query.validation.middleware';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
        this.router.get(
            `${this.path}/:id`,
            validationMiddleware(validate.get),
            this.get
        );
        this.router.get(
            `${this.path}`,
            [queryValidationMiddleware(validate.getManyQuery)],
            this.getMany
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);

            res.status(201).json({ post });
        } catch (e) {
            next(new HttpException(400, 'Cannot crete post'));
        }
    };

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const post = await this.PostService.get(id);

            if (post !== null) {
                res.status(200).json(post);
            } else {
                res.status(404).json('Not found');
            }
        } catch (e) {
            next(new HttpException(404, 'Not found'));
        }
    };

    private getMany = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const filters = req.query;
            const posts = await this.PostService.getMany(filters);
            res.status(200).json({ posts });
        } catch (e) {
            next(new HttpException(404, 'Could not get posts'));
        }
    };
}

export default PostController;
