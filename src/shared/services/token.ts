import authConfig from '@config/authConfig';
import jwt, { SignOptions } from 'jsonwebtoken';

const signOptions = {
  algorithm: 'RS256',
  expiresIn: authConfig.jwt.duration,
} as SignOptions;

const sign = async (
  payload: string | object | Buffer,
  sub: string,
): Promise<string> => {
  return jwt.sign(payload, authConfig.jwt.privateKey, {
    ...signOptions,
    subject: sub,
  });
};

const verify = async (token: string): Promise<string | object> => {
  return jwt.verify(token, authConfig.jwt.publicKey);
};

export { sign, verify };
