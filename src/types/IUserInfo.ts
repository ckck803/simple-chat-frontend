export interface IUserInfo{
  userId: string
  username: string,
  email: string,
  roleList?: []
}

export interface ILoginType  {
  email: string,
  password: string
}