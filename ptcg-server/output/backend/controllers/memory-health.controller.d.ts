import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class MemoryHealthController extends Controller {
    private memoryOptimization;
    private memoryMonitor;
    constructor(path: string, app: any, db: any, core: any);
    /**
     * Get current memory health status
     */
    getMemoryHealth(req: Request, res: Response): Promise<void>;
    /**
     * Get memory history and trends
     */
    getMemoryHistory(req: Request, res: Response): Promise<void>;
    /**
     * Force memory optimization
     */
    forceOptimization(req: Request, res: Response): Promise<void>;
    /**
     * Force garbage collection
     */
    forceGarbageCollection(req: Request, res: Response): Promise<void>;
    /**
     * Update memory optimization configuration
     */
    updateConfig(req: Request, res: Response): Promise<void>;
    /**
     * Get memory optimization status
     */
    getOptimizationStatus(req: Request, res: Response): Promise<void>;
}
