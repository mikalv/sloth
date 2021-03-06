json.array! @subscribed_channels.includes(:notifications) do |channel|
  json.id channel.id
  if channel.direct
    json.name (channel.name.split(',').reject {|name| name === current_user.username}).join(', ')
  else
    json.name channel.name
  end

  json.creator channel.creator
  json.purpose channel.purpose
  json.direct channel.direct
  json.members channel.members
  json.numMembers channel.members.length
  json.created_at channel.created_at.to_date
  json.notifications channel.notifications.where(user_id: current_user.id).length
end
