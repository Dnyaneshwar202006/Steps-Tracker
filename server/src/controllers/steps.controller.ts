import { Request, Response } from "express";
import { getHistory, getStepsByDate, saveSteps } from "../services/steps.service";

export const saveStep = async (req: Request, res: Response) => {
    try{
        const{ date, steps } = req.body;
        const result = await saveSteps(req.user!.id, date, steps);

        return res.status(200).json({
            message: "Steps saved successfully",
            result
        })
    }catch(error){
        console.error("Error: in saving steps ", error);
        return res.status(500).json({
            message: "Steps were'nt saved",
        })
    }
}

export const getSteps = async (req: Request, res: Response) => {
    try{
        const { date } = req.query;
        const result = await getStepsByDate(req.user!.id, date as string);

        return res.status(200).json({
            message: "User steps fetched",
            result
        })
    }catch(error){
        console.error("Error: in fetching steps ", error);

        return res.status(500).json({
            message: "Internal server Error in fetching steps..."
        })
    }
}

export const getTheHistory = async (req: Request, res: Response) => {
    try{
        const result = await getHistory(req.user!.id);

        return res.status(200).json({
            message: "Successfully fetched the history of the steps over multiple days",
            result
        })
    }catch(error){
        console.error("Error: fetching history of steps", error);
        res.status(500).json({
            message: "Unable to fetch the history.. "
        })
    }
}