import { Request, Response } from 'express';
import { prisma } from '../../config/dbConnect';
import { responseCodes } from '../../utils/response-codes';

// Add a member to a community using joinCode
export const join_community = async (req: Request, res: Response) => {
  try {
    const { joinCode, userId } = req.body;

    // Check if the user is authenticated
    if (!userId) {
      return responseCodes.clientError.unauthorized(res, 'Unauthorized');
    }

    // Find the community by joinCode
    const community = await prisma.community.findUnique({
      where: { joinCode },
      include: {
        members: true, // Include current members to check if the user is already a member
      },
    });

    if (!community) {
      return responseCodes.clientError.notFound(res, 'Invalid join code');
    }

    // Check if the user is already a member of the community
    const isAlreadyMember = community.members.some(member => member.userId === userId);
    if (isAlreadyMember) {
      return responseCodes.clientError.badRequest(res, 'User is already a member of the community');
    }

    // Add the user as a member
    await prisma.communityMember.create({
      data: {
        userId,
        communityId: community.id,
        role: 'MEMBER', // By default, the role will be MEMBER
      },
    });

    // Return success response
    return responseCodes.success.ok(res, { communityId: community.id }, 'Joined the community successfully');
  } catch (error) {
    console.error('Error joining community:', error);
    return responseCodes.serverError.internalServerError(res, 'Internal server error');
  }
};
