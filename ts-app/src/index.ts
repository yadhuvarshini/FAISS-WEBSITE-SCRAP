import express, {Request, Response} from 'express';
import usersRoutes from './routes/users.routes';
import postsRoutes from './routes/posts.routes';
import commentsRoutes from './routes/comments.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import cors from "cors";



export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 6500;

app.use(cors({
    origin: "*", // allow all origins (for dev)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.get("/ping", (req, res) => res.send("pong"));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//GET /users → list all users with their posts.

//GET /posts → list all posts with author + comments.

//POST /posts → create a new post for a user.
//body: {title: string, content: string, published: boolean, authorId: number}

//POST /comments → add a comment to a post.
//body: {text: string, postId: number}

//DELETE /posts/:id → delete a post and all its comments
//body: {id: number}

//DELETE /comments/:id → delete a comment
//body: {id: number}

//DELETE /users/:id → delete a user and all their posts
//body: {id: number}

//PUT /posts/:id → update a post
//body: {title: string, content: string, published: boolean}

//PUT /comments/:id → update a comment
//body: {text: string}

//PUT /users/:id → update a user
//body: {name: string, email: string}

