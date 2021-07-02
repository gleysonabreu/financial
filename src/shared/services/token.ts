import authConfig from '@config/authConfig';
import jwt, { SignOptions } from 'jsonwebtoken';

const signOptions = {
  algorithm: 'RS256',
  expiresIn: authConfig.jwt.duration,
} as SignOptions;

interface IJwt {
  user: {
    id: string;
    roles: string[];
  };
}
interface IJwtRequest {
  payload: IJwt | string | Buffer;
  sub: string;
}

export type IJwtResponse = IJwt & {
  sub: string;
};

const sign = async ({ payload, sub }: IJwtRequest): Promise<string> => {
  return jwt.sign(payload, authConfig.jwt.privateKey, {
    ...signOptions,
    subject: sub,
  });
};

const verify = async (token: string): Promise<string | IJwtResponse> => {
  return jwt.verify(token, authConfig.jwt.publicKey) as IJwtResponse | string;
};

export { sign, verify };
