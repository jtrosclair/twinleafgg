import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Friends extends Controller {
    onGetFriendsList(req: Request, res: Response): Promise<void>;
    onGetPendingRequests(req: Request, res: Response): Promise<void>;
    onGetSentRequests(req: Request, res: Response): Promise<void>;
    onSendFriendRequest(req: Request, res: Response): Promise<void>;
    onAcceptFriendRequest(req: Request, res: Response): Promise<void>;
    onRejectFriendRequest(req: Request, res: Response): Promise<void>;
    onCancelFriendRequest(req: Request, res: Response): Promise<void>;
    onRemoveFriend(req: Request, res: Response): Promise<void>;
    onBlockUser(req: Request, res: Response): Promise<void>;
    onUnblockUser(req: Request, res: Response): Promise<void>;
}
