import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../auth/user.schema';

export const GetUser = createParamDecorator((_, ctx): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
