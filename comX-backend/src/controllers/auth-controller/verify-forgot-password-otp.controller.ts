import { Request, Response } from "express";
import { prisma } from "../../config/dbConnect";
import { responseCodes } from "../../utils/response-codes";
export const verify_forgot_password_otp = async(req: Request, res: Response) => {
    const {email, otp} = req.body;
    const user = await prisma.user.findUnique({
        where:{
            email: email,
        }
    });
    if(!user){
        return responseCodes.clientError.notFound(res, "user not found with this email or user email is not verified");
    }
    const currentTime = new Date();
    if (user.otp !== otp || user.isOtpValid === null || currentTime > user.isOtpValid) {
        
        return responseCodes.clientError.badRequest(res, "Invalid or expired OTP");
    }

    await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isVerified: true,
          otp: null,             
          isOtpValid: null,       
        },
      });
  
      return responseCodes.success.ok(res, "forgot password otp verified successfully");
}


export const change_password = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const user = await prisma.user.update({
            where:{
                email: email,
                isVerified: true
            },
            data:{
                password: password
            }
        });
        if(!user){
            return responseCodes.clientError.notFound(res, "user not found with this email");
        }
        return responseCodes.success.ok(res, "Password changed");
    }   
    catch(error){
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }

}  