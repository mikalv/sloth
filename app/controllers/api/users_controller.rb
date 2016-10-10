class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if @user.save
      login!(@user)
      @user.subscribed_channels << Channel.first
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def index
    @users = User.where('id != ?', current_user.id)
  end

  private
  def user_params
    params.require(:user).permit(:username, :password, :email)
  end
end
