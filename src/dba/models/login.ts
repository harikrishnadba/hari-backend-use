import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelizeConnection from "../config";

interface LoginAttributes {
  id: number;
  name?: string;
  email?: string;
  phone: string;
  otp?: string;
  hashed_password?: string;
  otpExpires: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput extends Optional<LoginAttributes, 'id'> {}
export interface UserOutput extends Required<LoginAttributes> {}

class Login extends Model<LoginAttributes, UserInput> implements LoginAttributes {
  public id!: number;
  public name?: string;
  public email?: string;
  public phone!: string;
  public otp?: string;
  public hashed_password?: string;
  public otpExpires!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Method to compare password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashed_password || '');
  }
}

Login.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'Login',
    hooks: {
      beforeSave: async (user: Login) => {
        if (user.hashed_password) {
          const salt = await bcrypt.genSalt(10);
          user.hashed_password = await bcrypt.hash(user.hashed_password, salt);
        }
      },
    }
  }
);

export default Login;
