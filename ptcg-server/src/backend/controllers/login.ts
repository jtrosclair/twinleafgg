import { Request, Response, NextFunction } from 'express';
import { AuthToken, Validate, check, generateToken } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { LoginRequest, RegisterRequest, ServerConfig } from '../interfaces';
import { Md5 } from '../../utils/md5';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { config } from '../../config';


export class Login extends Controller {

  private rateLimit = RateLimit.getInstance();

  @Post('/register')
  @Validate({
    name: check().isName(),
    email: check().isEmail(),
    password: check().isPassword()
  })
  public async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;
    res.send({ ok: true });
  }

  @Post('')
  @Validate({
    name: check().isName(),
    password: check().isString()
  })
  public async onLogin(req: Request, res: Response) {

    res.send({
      ok: true
    });
  }

  @Get('/refreshToken')
  @AuthToken()
  public async onRefreshToken(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const token = generateToken(userId);
    res.send({ ok: true, token, config: this.getServerConfig() });
  }

  @Get('/logout')
  @AuthToken()
  public onLogout(req: Request, res: Response) {
    res.send({ ok: true });
  }

  @Get('/info')
  public onInfo(req: Request, res: Response) {
    res.send({ ok: true, config: this.getServerConfig() });
  }

  @Post('/anonymous')
  public async onAnonymousLogin(req: Request, res: Response) {
    // Create and persist an anonymous user to the database
    const anonymousName = `Guest_${Math.random().toString(36).substring(2, 15)}`;

    const user = new User();
    user.name = anonymousName;
    user.roleId = 2; // Regular user role
    user.registered = Date.now();
    const updatedUser = await user.save();

    const token = generateToken(user.id);
    res.send({
      ok: true,
      token,
      config: this.getServerConfig(),
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        roleId: updatedUser.roleId,
        isAnonymous: true
      }
    });
  }

  private getServerConfig(): ServerConfig {
    return {
      apiVersion: 2,
      defaultPageSize: config.backend.defaultPageSize,
      scansUrl: config.sets.scansUrl,
      avatarsUrl: config.backend.avatarsUrl,
      avatarFileSize: config.backend.avatarFileSize,
      avatarMinSize: config.backend.avatarMinSize,
      avatarMaxSize: config.backend.avatarMaxSize,
      replayFileSize: config.backend.replayFileSize,
      refreshTokenInterval: config.backend.refreshTokenInterval
    };
  }

}
