# == Schema Information
#
# Table name: users
#
#  id                  :integer          not null, primary key
#  username            :string           not null
#  email               :string           not null
#  password_digest     :string           not null
#  session_token       :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  avatar_file_name    :string
#  avatar_content_type :string
#  avatar_file_size    :integer
#  avatar_updated_at   :datetime
#

class User < ActiveRecord::Base
  before_validation :ensure_session_token

  has_many :created_channels,
    class_name: 'Channel',
    foreign_key: :creator_id
  has_many :channel_memberships,
    foreign_key: :member_id
  has_many :subscribed_channels,
    through: :channel_memberships,
    source: :channel
  has_many :notifications
  has_attached_file :avatar,
    default_url: Faker::Avatar.image(('a'..'z').to_a.sample(12).join)

  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  validates :username, :email, :session_token,
    presence: true, uniqueness: true
  validates :password_digest, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }

  attr_reader :password

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def self.find_by_credentials(username, password)
    user = find_by_username(username)

    if user && user.password_matches?(password)
      user
    else
      nil
    end
  end

  def password_matches?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  private
  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
