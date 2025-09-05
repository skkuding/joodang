import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Try to parse JWT; never throw on failure
  handleRequest(err: any, user: any) {
    // Do not throw on error; simply return null when no valid user
    if (err || !user) {
      return null;
    }
    return user;
  }
}
