import { Request, Response, NextFunction, RequestHandler } from 'express';
import { config } from '../../config';

export function cors(): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): any {
    const allowedOrigins = [
      'https://play.twinleaf.gg',
      'http://localhost:4200',
      'https://6eca7fef82e8.ngrok-free.app/',
      'http://sim.prizemap.app',
      'https://sim.prizemap.app',
      'http://sim-mobile.prizemap.app',
      'https://sim-mobile.prizemap.app',
      'http://localhost:3000',
      'https://prizemap.app',
      'https://www.prizemap.app',
      'https://prod.d2b8enpmjk7lxy.amplifyapp.com'
    ];
    const origin = req.headers.origin;
    if (config.backend.allowCors && origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
    res.header('Access-Control-Allow-Headers', [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Auth-Token'
    ].join(','));

    // Allow embedding in iframes from allowed origins
    const frameAncestors = allowedOrigins.join(' ');
    res.header('Content-Security-Policy', `frame-ancestors 'self' ${frameAncestors}`);

    next();
  };
}
