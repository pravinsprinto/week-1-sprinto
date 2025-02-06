import { NextRequest } from 'next/server';
import { authenticateUser } from '../lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest) => {
  try {
    // console.log('came here' , req.headers)
    const token = (req.headers?.get?.('authorization') || (req.headers as any)?.['authorization'])?.replace('Bearer ', '');
    // console.log(token,"token")
    if (!token) {
      return {user: null}
    }

    const user = await authenticateUser(token);
    if (!user) {
      throw new Error('Invalid token');
    }

    return { user };
  } catch (error:any) {
    console.error(error)
    throw new Error('Authentication failed: ' + error.message);
  }
}; 