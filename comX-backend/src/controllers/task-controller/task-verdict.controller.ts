import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
import { prisma } from "../../config/dbConnect";
import { Status } from "@prisma/client";

export const complete_task = async (req: Request, res: Response) => {
    try {
        const {taskId, verdict, completedDate} = req.body;
        let status:Status = 'PENDING';
        if(verdict == 'Accepted'){
            status = 'COMPLETED';
        }
        else if(verdict == 'Rejected'){
            status = 'INPROGRESS';
        }
        else{
            return responseCodes.clientError.badRequest(res, "not a valid verdict");
        }
        await prisma.task.update({
            data:{
                status: status,
                completedDate: completedDate
            },
            where:{
                id: taskId
            }
        })
        return responseCodes.success.ok(res, "Task verdict applied.");
    } catch (error) {
        console.error(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
