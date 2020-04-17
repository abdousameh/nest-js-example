import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as fs from 'fs';
import { UsersService } from './users.service';
import { User } from './user.model';
import { LoggerService } from '../logger/logger.service';
import { UploadExceptionFilter } from '../filter/upload-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOAD_OPTIONS } from '../config/global.env';
import { UploadError } from '../error/upload.error';
import { MailService } from '../shared/services/mail.service';

@Controller('users')
export class UsersController {
  private readonly logger = new LoggerService(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: User): Promise<{ id: string }> {
    return await this.usersService.insertUser(user);
  }

  @Post('mail')
  async sendMail() {
    this.logger.setMethod(this.sendMail.name);
    const mailer = new MailService();
    mailer.sendMail(process.env.MAILER_RECIPIENT, 'Test', 'Test');
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    this.logger.setMethod(this.getUser.name);
    return await this.usersService.getSingleUser(username);
  }

  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body('lastName') lastName: string,
    @Body('firstName') firstName: string,
    @Body('email') email: string,
  ) {
    this.logger.setMethod(this.updateUser.name);
    await this.usersService.updateUser(username, lastName, firstName, email);
    return null;
  }

  @Delete(':username')
  async removeUser(@Param('username') username: string) {
    this.logger.setMethod(this.removeUser.name);
    await this.usersService.deleteUser(username);
  }

  @Patch('/new-username/:username')
  async changeUsername(
    @Param('username') username: string,
    @Body('newUsername') newUsername: string,
  ) {
    this.logger.setMethod(this.changeUsername.name);
    await this.usersService.changeUsername(username, newUsername);
    return null;
  }

  @Patch('new-password/:username')
  async changePassword(
    @Param('username') username: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    this.logger.setMethod(this.changePassword.name);
    await this.usersService.changePassword(username, oldPassword, newPassword);
    return null;
  }

  /**
   * If you want to test file upload, you need to modify UploadExceptionFilter by replacing
   * @Catch(UploadError) by @Catch().
   */
  @Post('upload/:username')
  @UseFilters(new UploadExceptionFilter())
  @UseInterceptors(FileInterceptor('avatar', UPLOAD_OPTIONS))
  async uploadAvatarFile(
    @Param('username') username: string,
    @UploadedFile() file,
  ) {
    let usernameFound = true;
    try {
      this.logger.setMethod(this.uploadAvatarFile.name);
      const user = await this.usersService.findUser(username);
      if (!user) {
        usernameFound = false;
        this.logger.error(`Error uploading file ${this.uploadAvatarFile.name}`);
        throw new UploadError(`Could not find user with username ${username}.`);
      }
      const oldPath: string = file.path;
      const originalName = file.originalname as string;
      const originalExtansion = originalName.substr(originalName.indexOf('.'));
      const fileExtansion = originalExtansion
        ? originalExtansion.toLowerCase()
        : null;
      const newFilename = `avatar_${username}${fileExtansion}`;
      const newPath = oldPath.replace(file.filename, newFilename);
      fs.renameSync(oldPath, newPath);
      return {
        filename: originalName,
        statusCode: 201,
      };
    } catch (error) {
      this.logger.error(
        `Error uploading file ${this.uploadAvatarFile.name}`,
        error,
      );
      if (!usernameFound) {
        throw new UploadError(`Could not find user with username ${username}.`);
      } else {
        throw new Error(
          `Error during avatar file upload for user ${username}.`,
        );
      }
    }
  }
}
