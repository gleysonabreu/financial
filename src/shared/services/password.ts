import authConfig from '@config/authConfig';
import bcryptjs from 'bcryptjs';

const hash = async (value: string): Promise<string> => {
  return bcryptjs.hash(value, authConfig.hashSaltRounds);
};

const compare = async (value: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(value, hash);
};

export { compare, hash };
