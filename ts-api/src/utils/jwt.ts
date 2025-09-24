import jwt, { Secret, SignOptions }  from "jsonwebtoken";

// Read directly from environment to avoid circular imports
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string | undefined = process.env.JWT_EXPIRES_IN;

export type jwtPayload = { userId : number; email:string}

export function signToken(payload:jwtPayload){
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
    const secret: Secret = JWT_SECRET as string;
    const options: SignOptions = JWT_EXPIRES_IN
        ? { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] }
        : {};
    return jwt.sign(payload, secret, options);
}

export function verifyToken(token:string){
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
    const decoded = jwt.verify(token, JWT_SECRET as Secret);
    if (typeof decoded !== 'object' || decoded === null) {
        throw new Error('Invalid token payload');
    }
    const maybePayload = decoded as Partial<jwtPayload>;
    if (typeof maybePayload.userId !== 'number' || typeof maybePayload.email !== 'string') {
        throw new Error('Invalid token payload');
    }
    return { userId: maybePayload.userId, email: maybePayload.email };
}