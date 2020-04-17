import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import * as bcrypt from 'bcryptjs';
import { ReturnModelType } from '@typegoose/typegoose';

import { User } from './user.model';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  private readonly logger = new LoggerService(UsersService.name);
  constructor(
    @Optional()
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  /**
   * Create a new user.
   *
   * @param user user to be created
   * @returns the id of the user if created
   */
  async insertUser(user: User): Promise<{ id: string }> {
    this.logger.setMethod(this.insertUser.name);
    const userFound = await this.findUser(user.email, true);
    if (userFound) {
      throw new UnprocessableEntityException(
        `This email ${user.email} already exists.`,
      );
    }
    if (!this.validatePassword(user.password)) {
      throw new UnprocessableEntityException(
        `The entered password does not agree validation rules.`,
      );
    }
    const hashedPwd = bcrypt.hashSync(user.password, 8);
    const createdUser = new this.userModel(user);
    createdUser.username = createdUser.email;
    createdUser.password = hashedPwd;
    const result = await createdUser.save();
    return { id: result._id as string };
  }

  /**
   * Get a user from username.
   *
   * @param username username of the user
   * @returns user informations
   */
  async getSingleUser(username: string) {
    this.logger.setMethod(this.getSingleUser.name);
    const userFound = await this.findUser(username);
    if (!userFound) {
      throw new UnprocessableEntityException(
        `This user ${username} does  not exist.`,
      );
    }
    return {
      lastName: userFound.lastname,
      firstName: userFound.firstname,
      username: userFound.username,
      email: userFound.email,
    };
  }

  /**
   * Update user informations.
   *
   * @param username username to be updated
   * @param lastName lastname
   * @param firstName  firstname
   * @param email email
   */
  async updateUser(
    username: string,
    lastname: string,
    firstname: string,
    email: string,
  ) {
    this.logger.setMethod(this.updateUser.name);
    let user = await this.findEmail(email);
    if (user && username !== user.username) {
      throw new UnprocessableEntityException(
        `A username different from ${username} with the new email address has been found.`,
      );
    }
    user = await this.findUser(username);
    if (!user) {
      throw new NotFoundException(
        `Could not find user with username ${username}.`,
      );
    }
    user.lastname = lastname ? lastname : user.lastname;
    user.firstname = firstname ? firstname : user.firstname;
    user.email = email ? email : user.email;
    new this.userModel(user).save();
    return null;
  }

  /**
   * Change the username of a user.
   *
   * @param newUsername new username of the user
   */
  async changeUsername(username: string, newUsername: string) {
    this.logger.setMethod(this.changeUsername.name);
    let user = await this.findUser(newUsername);
    if (user) {
      throw new UnprocessableEntityException(
        `This email ${newUsername} already exists.`,
      );
    }
    user = await this.findUser(username);
    user.username = newUsername;
    new this.userModel(user).save();
    return null;
  }

  /**
   * This method allow to change user password.
   *
   * @param username username
   * @param oldPassword old password
   * @param newPassword new password
   */
  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ) {
    this.logger.setMethod(this.changePassword.name);
    const user = await this.findUser(username);
    if (!user) {
      throw new NotFoundException(
        `Could not find user with username ${username}.`,
      );
    }
    if (!bcrypt.compare(oldPassword, user.password)) {
      throw new UnprocessableEntityException(
        `Bad password for username${username}.`,
      );
    }
    if (!this.validatePassword(newPassword)) {
      throw new UnprocessableEntityException(
        `The entered password does not agree validation rules.`,
      );
    }
    const hashedPwd = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPwd;
    new this.userModel(user).save();
    return null;
  }

  /**
   * Delete a user.
   *
   * @param username usrname to be deleted
   */
  async deleteUser(username: string) {
    this.logger.setMethod(this.deleteUser.name);
    await this.userModel.deleteOne({ username: username }).then(res => {
      if (res.n === 0) {
        throw new NotFoundException(
          `Could not find user with username ${username}.`,
        );
      }
    });
    return null;
  }

  /**
   * This method allows to update the avatar path of a user.
   *
   * @param username username to be updated
   * @param avatarPath new avatar path
   */
  async updateAvatarPath(username: string, avatarPath: string) {
    this.logger.setMethod(this.updateAvatarPath.name);
    const user = await this.findUser(username);
    if (!user) {
      throw new NotFoundException(
        `Could not find user with username ${username}.`,
      );
    }
    user.avatarPath = avatarPath;
    new this.userModel(user).save();
    return null;
  }

  /**
   * This function checks if a user exists in the database.
   *
   * @param username username to check
   * @param checkAlsoEmail flag indicating if you have to verify if a user with this email exists
   * @returns user informations if found
   */
  async findUser(
    username: string,
    checkAlsoEmail = false,
  ): Promise<User | undefined> {
    this.logger.setMethod(this.findUser.name);
    let user: User;
    try {
      user = await this.userModel.findOne({ username: username });
      if (!user && checkAlsoEmail) {
        user = await this.userModel.findOne({ email: username });
      }
    } catch (error) {
      this.logger.error(
        `Could not find user with username ${username}.`,
        error,
      );
      throw new NotFoundException(
        `Could not find user with username ${username}.`,
      );
    }
    return user;
  }

  /**
   * This function checks if a user exists with the email in the database.
   *
   * @param email email to check
   * @returns user informations if found
   */
  async findEmail(email: string): Promise<User | undefined> {
    this.logger.setMethod(this.findEmail.name);
    let user: User;
    try {
      user = await this.userModel.findOne({ email: email });
    } catch (error) {
      this.logger.error(`Could not find user with email ${email}.`, error);
      throw new NotFoundException(`Could not find user with email ${email}.`);
    }
    return user;
  }

  /**
   * This function is used to validate a password.
   *
   * @param password password to be validated
   * @returns true if password is Ok and false in other cases
   */
  private validatePassword(password: string): boolean {
    this.logger.setMethod(this.validatePassword.name);
    const pwdRegexec = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]){8,}';
    const moreUsedPwd: string[] = [
      '12345678',
      '123456789',
      'password1',
      'sunshine',
      'iloveyou',
      'princess',
      'welcome',
      'football',
      'aa123456',
      'qwerty123',
      'password',
    ];
    if (password.length < 8) {
      return false;
    }
    moreUsedPwd.forEach(pwd => {
      if (pwd === password) {
        return false;
      }
    });
    // Minimum eight characters, at least one uppercase letter,
    // one lowercase letter, one number and one special character
    if (!password.match(pwdRegexec)) {
      return false;
    }
    return true;
  }
}
