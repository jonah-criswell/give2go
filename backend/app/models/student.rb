class Student < ApplicationRecord
  has_secure_password
  
  # Active Storage for profile pictures
  has_one_attached :profile_picture

  has_many :donations, dependent: :destroy
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :year, inclusion: { in: %w[1st 2nd 3rd 4th 5th grad_student other], allow_blank: true }
  validates :balance, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :bio, length: { maximum: 400 }, allow_blank: true
  validates :headline, length: { maximum: 100 }, allow_blank: true
  validates :major, length: { maximum: 100 }, allow_blank: true
  
  # Profile picture validation
  validates_each :profile_picture do |record, attr, value|
    if value.attached?
      unless value.content_type.in?(%w[image/png image/jpeg image/jpg image/gif])
        record.errors.add(attr, 'must be a PNG, JPEG, JPG, or GIF')
      end
      if value.blob.byte_size > 5.megabytes
        record.errors.add(attr, 'must be less than 5MB')
      end
    end
  end
  
  # Associations
  belongs_to :university
  has_one :student_profile, dependent: :destroy
  has_one :trip, through: :student_profile
  
  # For filtering students by university
  scope :by_university, ->(university) { joins(:university).where(universities: { name: university }) }
  
  # Scope to order students so that those at 100% of their goal are last
  scope :order_by_progress, -> {
    joins("LEFT JOIN student_profiles ON student_profiles.student_id = students.id")
      .joins("LEFT JOIN trips ON trips.id = student_profiles.trip_id")
      .select('students.*, COALESCE(students.balance / NULLIF(trips.goal_amount, 0), 0) AS progress_ratio, trips.goal_amount AS trip_goal')
      .order(Arel.sql('CASE WHEN trips.goal_amount IS NOT NULL AND students.balance >= trips.goal_amount THEN 1 ELSE 0 END, progress_ratio DESC'))
  }
  
  def display_name
    "#{name} (#{university.name})"
  end
  
  def formatted_balance
    "$#{balance.to_f.round(2)}"
  end
  
  def progress_percentage
    return 0 if trip.nil? || trip.donation_goal.nil? || trip.donation_goal.zero?
    ((balance.to_f / trip.donation_goal.to_f) * 100).round(1)
  end
end
