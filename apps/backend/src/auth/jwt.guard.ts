import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@auth/public.decorator';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { OptionalJwtAuthGuard } from '@auth/optional-jwt.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}


		// Skip strict auth if OptionalJwtAuthGuard is applied on this route
		const appliedGuards = this.reflector.getAllAndOverride<any[]>(GUARDS_METADATA, [
			context.getHandler(),
			context.getClass(),
		]);
		if (appliedGuards?.some((g) => g === OptionalJwtAuthGuard)) {
			return true;
		}
		return super.canActivate(context);
	}
	handleRequest(err: any, user: any) {
		if (err || !user) {
			throw new UnauthorizedException('Missing or invalid authentication token');
		}
		return user;
	}
}
