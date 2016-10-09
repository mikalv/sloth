class Api::MessagesController < ApplicationController
  def index
    @channel_id = params[:channel_id]
    @messages = Message.where(channel_id: @channel_id)
  end

  def create
    @message = Message.new(message_params)
    @message.author_id = current_user.id
    @message.channel_id = params[:channel_id]

    if @message.save
      Pusher.trigger(
        'new_messages',
        @message.channel_id.to_s,
        {}
      )
      render :show
    else
      render json: @message.errors.full_messages
    end
  end

  def update
    @message = Message.find(params[:id])

    if @message.update(message_params)
      @message.edited = true
      @message.save

      Pusher.trigger(
        'new_messages',
        @message.channel_id.to_s,
        {}
      )
      
      render :show
    else
      render json: @message.errors.full_messages
    end
  end

  def destroy
    @message = Message.find(params[:id])

    if @message.destroy
      render json: {}
    else
      render json: ["Message not found"], status: 404
    end
  end

  private
  def message_params
    params.require(:message).permit(:body)
  end
end
