import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { ApplyOwnerDto } from './dto/apply-owner.dto'
import { AdminGuard } from '@app/auth/admin.guard'
import { JwtAuthGuard } from '@app/auth/jwt.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/role')
  @UseGuards(JwtAuthGuard)
  async getUserRole(@Req() req) {
    return this.userService.getUserRole(req.user.id)
  }

  @Get('owner-application')
  @UseGuards(AdminGuard)
  async getOwnerApplications(
    @Query('isConfirmed', new ParseBoolPipe({ optional: true }))
    isConfirmed?: boolean,
  ) {
    return this.userService.getOwnerApplications(isConfirmed)
  }

  @Post('owner-application')
  @UseGuards(JwtAuthGuard)
  async applyForOwner(@Req() req, @Body() applyOwnerDto: ApplyOwnerDto) {
    return this.userService.applyForOwner(req.user.id, applyOwnerDto)
  }

  @Patch('owner-application/:id/confirm')
  @UseGuards(AdminGuard)
  async confirmOwnerApplication(
    @Param('id', ParseIntPipe) applicationId: number,
  ) {
    return this.userService.confirmOwnerApplication(applicationId)
  }
}
