import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { resolvers } from "../../graphql/resolver";
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { connectDB } from "@lib/sequelize";
import {dbConnect} from '../../lib/mongoose';
// import { readFileSync } from 'fs';
// import { join } from 'path';
// import { verifyToken } from '../../lib/auth';
const fs = require('fs');
const typeDefs = fs.readFileSync('./graphql/schema.graphql', 'utf8')
const server = new ApolloServer({
    typeDefs : typeDefs,
    resolvers,
});

// Typescript: req has the type NextRequest
export default startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        try {
            await connectDB()
            await dbConnect()
            const auth = await authMiddleware(req as AuthenticatedRequest);
            // console.log(auth.user)
            return { user: auth.user };
        } catch (error) {
            // Allow unauthenticated access to public queries/mutations
            return { user: null };
        }
    },
    
}); 

// export { handler as GET, handler as POST };